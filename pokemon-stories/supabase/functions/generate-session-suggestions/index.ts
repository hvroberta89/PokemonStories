import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
};

type Action =
  'event' | 'clue' | 'character' | 'summary' | 'foundation' | 'scene' | 'adventure-story';
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
    const providerResponse = await requestProvider(input);
    if (!providerResponse.ok) {
      console.error('AI provider request failed:', await providerResponse.text());
      return response({ error: 'Az AI szolgáltató most nem érhető el.' }, 502);
    }
    const result = await parseProviderResponse(providerResponse, input.context.aiConnection?.provider);
    if (input.action === 'summary') return response({ summary: validateStory(result) });
    if (input.action === 'foundation') {
      return response({ suggestions: validateFoundationSuggestions(result) });
    }
    if (input.action === 'scene') return response({ suggestions: validateSceneSuggestions(result) });
    if (input.action === 'adventure-story') {
      return response({ suggestions: validateAdventureStorySuggestions(result) });
    }
    return response({ suggestions: validateSuggestions(result) });
  } catch (error) {
    console.error('Session suggestion generation failed:', error);
    return response({ error: 'Az AI kérés nem feldolgozható.' }, 400);
  }
});

async function requestProvider(input: { action: Action; context: Context }): Promise<Response> {
  const connection = input.context.aiConnection;
  if (!connection?.apiKey || !isAiProvider(connection.provider)) throw new Error('AI szolgáltató beállítása hiányzik.');
  const prompt = createPrompt(input);
  if (connection.provider === 'anthropic') {
    return fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': connection.apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: connection.model || 'claude-3-5-haiku-latest', max_tokens: 2400, system: 'Kizárólag érvényes JSON-t adj vissza, Markdown formázás nélkül.', messages: [{ role: 'user', content: prompt }] }),
    });
  }
  return fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${connection.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: connection.model || 'gpt-4.1-mini',
        input: prompt,
        text: {
          format: {
            type: 'json_schema',
            name:
              input.action === 'summary'
                ? 'session_story'
                : input.action === 'foundation'
                  ? 'adventure_foundation_suggestions'
                  : input.action === 'scene'
                    ? 'adventure_scene_suggestions'
                    : input.action === 'adventure-story'
                      ? 'adventure_story_suggestions'
                      : 'session_suggestions',
            strict: true,
            schema: responseSchemaFor(input.action),
          },
        },
      }),
    });
}

async function parseProviderResponse(response: Response, provider: unknown): Promise<unknown> {
  if (provider === 'anthropic') {
    const data = await response.json() as { content?: { text?: string }[] };
    return JSON.parse(data.content?.[0]?.text ?? '');
  }
  const data = await response.json() as { output_text?: string };
  return JSON.parse(data.output_text ?? '');
}

function createPrompt(input: { action: Action; context: Context }): string {
  const { aiConnection: _aiConnection, ...promptContext } = input.context;
  const actionInstructions: Record<Action, string> = {
    event: 'Adj három rövid, játékos eseményötletet.',
    clue: 'Adj három rövid, fokozatosan felfedhető nyomötletet.',
    character: 'Adj három emlékezetes, gyerekbarát NPC-ötletet.',
    foundation:
      'Adj három jelentősen eltérő kalandalapot címmel és rövid premise-szel: játékos, rejtélyes és érzelmes irányban.',
    scene:
      'Adj három jelentősen eltérő, azonnal használható jelenetötletet címmel, leírással és egyetlen konkrét, cselekvő céllal.',
    'adventure-story':
      'Adj három jelentősen eltérő, teljes kalandívet nyitással, kibontakozással, csúcsponttal és lehetséges lezárással.',
    summary:
      'Írj rövid, meleg hangulatú, múlt idejű narratív Session Story draftot a fontos eseményekről és jutalmakról.',
  };
  return [
    'Te a Pokemon Stories kreatív segítője vagy. Magyarul válaszolj.',
    'Csak javaslatokat adj, ne döntsd el a történetet, ne hozz létre tartós Project-adatot.',
    'A célközönségnek megfelelően maradj játékos, biztonságos és erőszakmentes.',
    actionInstructions[input.action],
    input.action === 'summary'
      ? 'A Story legfeljebb 2000 karakter lehet, ne találj ki a kontextusban nem szereplő tényt.'
      : input.action === 'foundation'
        ? 'A három ötlet legyen érdemben különböző. A cím legfeljebb 120, a premise legfeljebb 1000 karakter lehet.'
        : input.action === 'scene'
          ? 'A három ötlet legyen érdemben különböző. A cím legfeljebb 120, a leírás legfeljebb 1000, a cél legfeljebb 200 karakter lehet.'
          : input.action === 'adventure-story'
            ? 'A három történetív legyen érdemben különböző. Minden mező legfeljebb 1500 karakter lehet.'
            : 'A három ötlet legyen érdemben különböző, címük legfeljebb 120, leírásuk legfeljebb 500 karakter.',
    assistantDirection(input.context.assistantProfile),
    `Kontextus: ${JSON.stringify(promptContext)}`,
  ].join('\n\n');
}

function assistantDirection(profile: Context['assistantProfile']): string {
  if (!profile?.enabled) return 'Az AI kreatív társ jelenleg ki van kapcsolva; csak a kért tartalmat add meg.';
  return [
    `A kreatív társ neve: ${profile.name?.trim() || 'Kalandsegítő'}.`,
    `Hangulata: ${profile.tone ?? 'playful'}.`,
    profile.proactive ? 'Kínálj kezdeményező, választható történeti irányokat is.' : 'Csak a közvetlenül kért javaslatokra szorítkozz.',
    profile.guidance?.trim() ? `Mesélői irány: ${profile.guidance.trim()}` : '',
  ].filter(Boolean).join(' ');
}

interface Context {
  adventureTitle?: string;
  locationName?: string;
  goal?: string;
  recentEvents?: string[];
  userContext?: string;
  rewards?: string[];
  idea?: string;
  premise?: string;
  audienceLabel?: string;
  sessionLengthMinutes?: number;
  direction?: string;
  assistantProfile?: {
    enabled: boolean;
    name?: string;
    tone?: string;
    proactive?: boolean;
    guidance?: string;
  };
  aiConnection?: { provider: 'openai' | 'anthropic'; model: string; apiKey: string };
}

function isAiProvider(value: unknown): value is 'openai' | 'anthropic' {
  return value === 'openai' || value === 'anthropic';
}

function validateRequest(value: unknown): { action: Action; context: Context } {
  if (typeof value !== 'object' || value === null) throw new Error('Invalid request.');
  const request = value as { action?: unknown; context?: unknown };
  if (
    !['event', 'clue', 'character', 'summary', 'foundation', 'scene', 'adventure-story'].includes(
      String(request.action),
    )
  )
    throw new Error('Invalid action.');
  const context = request.context as Partial<Context>;
  if (request.action === 'foundation') {
    if (
      !isText(context.idea, 1_000) ||
      !isText(context.audienceLabel, 160) ||
      !Number.isInteger(context.sessionLengthMinutes) ||
      context.sessionLengthMinutes <= 0
    ) {
      throw new Error('Invalid Foundation context.');
    }
    return { action: request.action as Action, context: context as Context };
  }
  if (request.action === 'scene') {
    if (
      !isText(context.adventureTitle, 160) ||
      !isText(context.premise, 1_000) ||
      !isText(context.audienceLabel, 160) ||
      !Number.isInteger(context.sessionLengthMinutes) ||
      context.sessionLengthMinutes <= 0 ||
      typeof context.direction !== 'string' ||
      context.direction.length > 500
    ) {
      throw new Error('Invalid Scene context.');
    }
    return { action: request.action as Action, context: context as Context };
  }
  if (request.action === 'adventure-story') {
    if (
      !isText(context.adventureTitle, 160) ||
      !isText(context.premise, 1_000) ||
      !isText(context.audienceLabel, 160) ||
      !Number.isInteger(context.sessionLengthMinutes) ||
      context.sessionLengthMinutes <= 0 ||
      typeof context.direction !== 'string' ||
      context.direction.length > 500
    ) {
      throw new Error('Invalid Adventure Story context.');
    }
    return { action: request.action as Action, context: context as Context };
  }
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

function validateFoundationSuggestions(value: unknown): { title: string; premise: string }[] {
  if (typeof value !== 'object' || value === null || !('suggestions' in value)) {
    throw new Error('Invalid response.');
  }
  const suggestions = (value as { suggestions: unknown }).suggestions;
  if (!Array.isArray(suggestions) || suggestions.length !== 3) {
    throw new Error('Invalid suggestions.');
  }
  if (!suggestions.every(isFoundationSuggestion)) throw new Error('Invalid suggestion.');
  return suggestions;
}

function validateSceneSuggestions(
  value: unknown,
): { title: string; description: string; goal: string }[] {
  if (typeof value !== 'object' || value === null || !('suggestions' in value)) {
    throw new Error('Invalid response.');
  }
  const suggestions = (value as { suggestions: unknown }).suggestions;
  if (
    !Array.isArray(suggestions) ||
    suggestions.length !== 3 ||
    !suggestions.every(isSceneSuggestion)
  ) {
    throw new Error('Invalid suggestions.');
  }
  return suggestions;
}

function validateAdventureStorySuggestions(
  value: unknown,
): { opening: string; development: string; climax: string; resolution: string }[] {
  if (typeof value !== 'object' || value === null || !('suggestions' in value)) {
    throw new Error('Invalid response.');
  }
  const suggestions = (value as { suggestions: unknown }).suggestions;
  if (
    !Array.isArray(suggestions) ||
    suggestions.length !== 3 ||
    !suggestions.every(isAdventureStorySuggestion)
  ) {
    throw new Error('Invalid suggestions.');
  }
  return suggestions;
}

function isSuggestion(value: unknown): value is Suggestion {
  if (typeof value !== 'object' || value === null) return false;
  const suggestion = value as Partial<Suggestion>;
  return isText(suggestion.title, 120) && isText(suggestion.description, 500);
}

function isFoundationSuggestion(value: unknown): value is { title: string; premise: string } {
  if (typeof value !== 'object' || value === null) return false;
  const suggestion = value as { title?: unknown; premise?: unknown };
  return isText(suggestion.title, 120) && isText(suggestion.premise, 1_000);
}

function isSceneSuggestion(
  value: unknown,
): value is { title: string; description: string; goal: string } {
  if (typeof value !== 'object' || value === null) return false;
  const suggestion = value as { title?: unknown; description?: unknown; goal?: unknown };
  return (
    isText(suggestion.title, 120) &&
    isText(suggestion.description, 1_000) &&
    isText(suggestion.goal, 200)
  );
}

function isAdventureStorySuggestion(
  value: unknown,
): value is { opening: string; development: string; climax: string; resolution: string } {
  if (typeof value !== 'object' || value === null) return false;
  const suggestion = value as {
    opening?: unknown;
    development?: unknown;
    climax?: unknown;
    resolution?: unknown;
  };
  return (
    isText(suggestion.opening, 1_500) &&
    isText(suggestion.development, 1_500) &&
    isText(suggestion.climax, 1_500) &&
    isText(suggestion.resolution, 1_500)
  );
}

function responseSchemaFor(action: Action): object {
  if (action === 'summary') {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['summary'],
      properties: { summary: { type: 'string' } },
    };
  }
  if (action === 'scene') {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['suggestions'],
      properties: {
        suggestions: {
          type: 'array',
          minItems: 3,
          maxItems: 3,
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'description', 'goal'],
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              goal: { type: 'string' },
            },
          },
        },
      },
    };
  }
  if (action === 'adventure-story') {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['suggestions'],
      properties: {
        suggestions: {
          type: 'array',
          minItems: 3,
          maxItems: 3,
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['opening', 'development', 'climax', 'resolution'],
            properties: {
              opening: { type: 'string' },
              development: { type: 'string' },
              climax: { type: 'string' },
              resolution: { type: 'string' },
            },
          },
        },
      },
    };
  }
  const contentField = action === 'foundation' ? 'premise' : 'description';
  return {
    type: 'object',
    additionalProperties: false,
    required: ['suggestions'],
    properties: {
      suggestions: {
        type: 'array',
        minItems: 3,
        maxItems: 3,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['title', contentField],
          properties: {
            title: { type: 'string' },
            [contentField]: { type: 'string' },
          },
        },
      },
    },
  };
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
