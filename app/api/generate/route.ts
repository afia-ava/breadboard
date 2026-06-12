import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.API_KEY ?? '');

const SYSTEM_PROMPT = `You are an expert hardware engineer with deep knowledge of electronics components, microcontrollers, sensors, and embedded systems. You help makers, hobbyists, and engineers select the right components for their projects.

When recommending components:
- Be specific about part numbers and models where possible
- Provide realistic USD price ranges (Amazon, Adafruit, SparkFun, AliExpress)
- Include essential peripherals: power supply, connectors, breadboard, cables
- Ensure all components in a tier work together (voltage, protocol compatibility)
- Flag common pitfalls and gotchas for each tier
- Budget tier: use the cheapest viable parts (clones, breakout boards, AliExpress)
- Mid-range tier: a solid balance of ease-of-use and capability
- Premium tier: professional/production-grade parts with the best performance`;

const TOOL_PARAMETERS = {
  type: 'object' as const,
  properties: {
    project_title: {
      type: 'string',
      description: 'Concise, descriptive title for the hardware project',
    },
    project_summary: {
      type: 'string',
      description: '2–3 sentences explaining what the project does and the technical approach',
    },
    tiers: {
      type: 'array',
      description: 'Exactly 3 tiers in order: budget, mid, premium',
      items: {
        type: 'object',
        properties: {
          tier: { type: 'string', enum: ['budget', 'mid', 'premium'] },
          label: { type: 'string' },
          total_price_min: { type: 'number' },
          total_price_max: { type: 'number' },
          components: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                price_min: { type: 'number' },
                price_max: { type: 'number' },
                purpose: { type: 'string' },
                notes: { type: 'string' },
              },
              required: ['name', 'price_min', 'price_max', 'purpose'],
            },
          },
          tradeoffs: { type: 'string' },
          gotchas: { type: 'array', items: { type: 'string' } },
        },
        required: ['tier', 'label', 'total_price_min', 'total_price_max', 'components', 'tradeoffs'],
      },
    },
  },
  required: ['project_title', 'project_summary', 'tiers'],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const description: string = body?.description ?? '';

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a more detailed project description.' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: SYSTEM_PROMPT,
      tools: [
        {
          functionDeclarations: [
            {
              name: 'recommend_hardware_components',
              description: 'Recommend hardware components across budget, mid-range, and premium tiers',
              parameters: TOOL_PARAMETERS,
            },
          ],
        },
      ],
      toolConfig: {
        functionCallingConfig: {
          mode: 'ANY' as const,
          allowedFunctionNames: ['recommend_hardware_components'],
        },
      },
    });

    const result = await model.generateContent(
      `I want to build a hardware project: ${description.trim()}\n\nRecommend components across budget, mid-range, and premium tiers.`
    );

    const parts = result.response.candidates?.[0]?.content?.parts ?? [];
    const fnCall = parts.find((p) => p.functionCall);

    if (!fnCall?.functionCall) {
      return NextResponse.json(
        { error: 'Failed to generate recommendations. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(fnCall.functionCall.args);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Gemini API error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
