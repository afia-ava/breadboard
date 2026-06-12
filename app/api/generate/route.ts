import { GoogleGenerativeAI, SchemaType, FunctionCallingMode } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.API_KEY ?? '');

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-flash-latest',
];

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

    const prompt = `I want to build a hardware project: ${description.trim()}\n\nRecommend components across budget, mid-range, and premium tiers.`;

    let lastError = '';
    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT,
          tools: [
            {
              functionDeclarations: [
                {
                  name: 'recommend_hardware_components',
                  description: 'Recommend hardware components across budget, mid-range, and premium tiers',
                  parameters: {
                    type: SchemaType.OBJECT,
                    required: ['project_title', 'project_summary', 'tiers'],
                    properties: {
                      project_title: { type: SchemaType.STRING, description: '' },
                      project_summary: { type: SchemaType.STRING, description: '' },
                      tiers: {
                        type: SchemaType.ARRAY,
                        items: {
                          type: SchemaType.OBJECT,
                          required: ['tier', 'label', 'total_price_min', 'total_price_max', 'components', 'tradeoffs'],
                          properties: {
                            tier: { type: SchemaType.STRING, description: '' },
                            label: { type: SchemaType.STRING, description: '' },
                            total_price_min: { type: SchemaType.NUMBER, description: '' },
                            total_price_max: { type: SchemaType.NUMBER, description: '' },
                            components: {
                              type: SchemaType.ARRAY,
                              items: {
                                type: SchemaType.OBJECT,
                                required: ['name', 'price_min', 'price_max', 'purpose'],
                                properties: {
                                  name: { type: SchemaType.STRING, description: '' },
                                  price_min: { type: SchemaType.NUMBER, description: '' },
                                  price_max: { type: SchemaType.NUMBER, description: '' },
                                  purpose: { type: SchemaType.STRING, description: '' },
                                  notes: { type: SchemaType.STRING, description: '' },
                                },
                              },
                            },
                            tradeoffs: { type: SchemaType.STRING, description: '' },
                            gotchas: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING, description: '' } },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          ],
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingMode.ANY,
              allowedFunctionNames: ['recommend_hardware_components'],
            },
          },
        });
        const result = await model.generateContent(prompt);
        const parts = result.response.candidates?.[0]?.content?.parts ?? [];
        const fnCall = parts.find((p) => p.functionCall);
        if (fnCall?.functionCall) {
          console.log(`Used model: ${modelName}`);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = fnCall.functionCall.args as any;
          // Normalize tier values so TierCard lookup never fails
          if (Array.isArray(data?.tiers)) {
            const TIER_MAP: Record<string, string> = {
              budget: 'budget', mid: 'mid', 'mid-range': 'mid', midrange: 'mid', premium: 'premium',
            };
            data.tiers = data.tiers.map((t: any) => ({
              ...t,
              tier: TIER_MAP[String(t.tier).toLowerCase().replace(/[^a-z]/g, '')] ?? t.tier,
            }));
          }
          return NextResponse.json(data);
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        console.warn(`Model ${modelName} failed: ${lastError}`);
      }
    }

    return NextResponse.json({ error: `All models failed. Last error: ${lastError}` }, { status: 500 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Request error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
