import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
};

type Action = 'event' | 'clue' | 'character' | 'summary';
type Suggestion = { title: string; description: string };

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return response({ error: 'Method not allowed.' }, 405);

  const authorization = request.headers.get('Authorization');
  if (!authorization) return response({ error: 'Unauthorized.' }, 401);

  const supabase = createClient(
    requiredEnvironment('SUPABASE_URL'),
    requiredEnvironment('SUPABASE_ANON_KEY'),
    { global: { headers: { Authorization: authorization } } },
  );
  const { error: userError } = await supabase.auth.getUser();
  if (userError) return response({ error: 'Unauthorized.' }, 401);

  try {
    const input = validateRequest(await request.json());
    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${requiredEnvironment('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: Deno.env.get('OPENAI_MODEL') ?? 'gpt-4.1-mini',
        input: createPrompt(input),
        text: {
          format: {
            type: 'json_schema',
            name: input.action === 'summary' ? 'session_story' : 'session_suggestions',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: [input.action === 'summary' ? 'summary' : 'suggestions'],
              properties: {
                summary: { type: 'string' },
                suggestions: {
                  type: 'array',
                  minItems: 3,
                  maxItems: 3,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['title', 'description'],
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    });
    if (!openAiResponse.ok) {
      console.error('OpenAI request failed:', await openAiResponse.text());
      return response({ error: 'Az AI segítő most nem érhető el.' }, 502);
    }
    const openAiData = (await openAiResponse.json()) as { output_text?: string };
    const result = JSON.parse(openAiData.output_text ?? '');
    if (input.action === 'summary') return response({ summary: validateStory(result) });
    return response({ suggestions: validateSuggestions(result) });
  } catch (error) {
    console.error('Session suggestion generation failed:', error);
    return response({ error: 'Az AI kérés nem feldolgozható.' }, 400);
  }
});

function createPrompt(input: { action: Action; context: Context }): string {
  const actionInstructions: Record<Action, string> = {
    event: 'Adj három rövid, játékos eseményötletet.',
    clue: 'Adj három rövid, fokozatosan felfedhető nyomötletet.',
    character: 'Adj három emlékezetes, gyerekbarát NPC-ötletet.',
    summary:
      'Írj rövid, meleg hangulatú, múlt idejű narratív Session Story draftot a fontos eseményekről és jutalmakról.',
  };
  return [
    'Te a Pokemon Stories kreatív Session segítője vagy. Magyarul válaszolj.',
    'Csak javaslatokat adj, ne döntsd el a történetet, ne hozz létre tartós Project-adatot.',
    'A célközönségnek megfelelően maradj játékos, biztonságos és erőszakmentes.',
    actionInstructions[input.action],
    input.action === 'summary'
      ? 'A Story legfeljebb 2000 karakter lehet, ne találj ki a kontextusban nem szereplő tényt.'
      : 'A három ötlet legyen érdemben különböző, címük legfeljebb 120, leírásuk legfeljebb 500 karakter.',
    `Session kontextus: ${JSON.stringify(input.context)}`,
  ].join('\n\n');
}

interface Context {
  adventureTitle: string;
  locationName: string;
  goal: string;
  recentEvents: string[];
  userContext: string;
  rewards?: string[];
}

function validateRequest(value: unknown): { action: Action; context: Context } {
  if (typeof value !== 'object' || value === null) throw new Error('Invalid request.');
  const request = value as { action?: unknown; context?: unknown };
  if (!['event', 'clue', 'character', 'summary'].includes(String(request.action)))
    throw new Error('Invalid action.');
  const context = request.context as Partial<Context>;
  if (
    !context ||
    !isText(context.adventureTitle, 160) ||
    !isText(context.locationName, 160) ||
    !isText(context.goal, 300) ||
    !Array.isArray(context.recentEvents) ||
    context.recentEvents.length > 5 ||
    !context.recentEvents.every((item) => isText(item, 700)) ||
    typeof context.userContext !== 'string' ||
    context.userContext.length > 280 ||
    (request.action === 'summary' &&
      (!Array.isArray(context.rewards) ||
        context.rewards.length > 30 ||
        !context.rewards.every((item) => isText(item, 300))))
  ) {
    throw new Error('Invalid context.');
  }
  return { action: request.action as Action, context: context as Context };
}

function validateStory(value: unknown): string {
  if (typeof value !== 'object' || value === null || !('summary' in value)) {
    throw new Error('Invalid story.');
  }
  const story = (value as { summary: unknown }).summary;
  if (!isText(story, 2_000)) throw new Error('Invalid story.');
  return story;
}

function validateSuggestions(value: unknown): Suggestion[] {
  if (typeof value !== 'object' || value === null || !('suggestions' in value)) {
    throw new Error('Invalid response.');
  }
  const suggestions = (value as { suggestions: unknown }).suggestions;
  if (!Array.isArray(suggestions) || suggestions.length !== 3)
    throw new Error('Invalid suggestions.');
  if (!suggestions.every(isSuggestion)) throw new Error('Invalid suggestion.');
  return suggestions;
}

function isSuggestion(value: unknown): value is Suggestion {
  if (typeof value !== 'object' || value === null) return false;
  const suggestion = value as Partial<Suggestion>;
  return isText(suggestion.title, 120) && isText(suggestion.description, 500);
}

function isText(value: unknown, maximumLength: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maximumLength;
}

function requiredEnvironment(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
