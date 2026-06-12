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
          label: {
            type: 'string',
            description: 'e.g. "Budget (<$20)" or "Mid-range ($20–60)" or "Premium ($60+)"',
          },
          total_price_min: { type: 'number', description: 'Minimum total cost in USD' },
          total_price_max: { type: 'number', description: 'Maximum total cost in USD' },
          components: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Component name and model/part number' },
                price_min: { type: 'number', description: 'Min price in USD' },
                price_max: { type: 'number', description: 'Max price in USD' },
                purpose: { type: 'string', description: 'Role this component plays in the project' },
                notes: {
                  type: 'string',
                  description: 'Optional: tips, alternatives, or compatibility warnings',
                },
              },
              required: ['name', 'price_min', 'price_max', 'purpose'],
            },
          },
          tradeoffs: {
            type: 'string',
            description: 'Honest pros and cons of choosing this budget tier',
          },
          gotchas: {
            type: 'array',
            items: { type: 'string' },
            description: 'Compatibility issues, power requirements, or common mistakes to watch for',
          },
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
              description:
                'Recommend hardware components for a project across budget, mid-range, and premium tiers',
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
      `I want to build a hardware project that does the following:\n\n${description.trim()}\n\nPlease recommend components across budget, mid-range, and premium tiers.`
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
    console.error('Error calling Gemini API:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
