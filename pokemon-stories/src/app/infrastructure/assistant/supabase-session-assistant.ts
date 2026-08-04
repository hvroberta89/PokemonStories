import { inject, Injectable } from '@angular/core';

import type {
  AdventureAssistant,
  AdventureFoundationContext,
  AdventureFoundationSuggestion,
  AdventureSceneSuggestion,
  AdventureSceneSuggestionContext,
  AdventureStorySuggestion,
  AdventureStorySuggestionContext,
} from '../../application/assistant/ports/adventure-assistant';
import type {
  SessionAssistant,
  SessionAssistantAction,
  SessionAssistantContext,
  SessionAssistantSuggestion,
  SessionStoryContext,
} from '../../application/assistant/ports/session-assistant';
import { SUPABASE_CLIENT } from '../supabase/supabase-client.token';
import { AiAssistantSettingsStore } from '../../features/assistant/services/ai-assistant-settings.store';

@Injectable()
export class SupabaseSessionAssistant implements SessionAssistant, AdventureAssistant {
  private readonly supabase = inject(SUPABASE_CLIENT);
  private readonly assistantSettings = inject(AiAssistantSettingsStore);

  async generateFoundationSuggestions(
    context: AdventureFoundationContext,
  ): Promise<readonly AdventureFoundationSuggestion[]> {
    const { data, error } = await this.supabase.functions.invoke('generate-session-suggestions', {
      body: { action: 'foundation', context: this.withAssistantSettings(context) },
    });
    if (error) throw new Error(await describeFunctionError(error));
    if (!isFoundationSuggestionResponse(data)) throw new Error('Az AI segítő hibás választ adott.');
    return data.suggestions;
  }

  async generateSceneSuggestions(
    context: AdventureSceneSuggestionContext,
  ): Promise<readonly AdventureSceneSuggestion[]> {
    const { data, error } = await this.supabase.functions.invoke('generate-session-suggestions', {
      body: { action: 'scene', context: this.withAssistantSettings(context) },
    });
    if (error) throw new Error(await describeFunctionError(error));
    if (!isSceneSuggestionResponse(data)) throw new Error('Az AI segítő hibás választ adott.');
    return data.suggestions;
  }

  async generateStorySuggestions(
    context: AdventureStorySuggestionContext,
  ): Promise<readonly AdventureStorySuggestion[]> {
    const { data, error } = await this.supabase.functions.invoke('generate-session-suggestions', {
      body: { action: 'adventure-story', context: this.withAssistantSettings(context) },
    });
    if (error) throw new Error(await describeFunctionError(error));
    if (!isAdventureStorySuggestionResponse(data)) throw new Error('Az AI segítő hibás választ adott.');
    return data.suggestions;
  }

  async generate(
    action: SessionAssistantAction,
    context: SessionAssistantContext,
  ): Promise<readonly SessionAssistantSuggestion[]> {
    const { data, error } = await this.supabase.functions.invoke('generate-session-suggestions', {
      body: { action, context: this.withAssistantSettings(context) },
    });
    if (error) throw new Error(await describeFunctionError(error));
    if (!isSuggestionResponse(data)) throw new Error('Az AI segítő hibás választ adott.');
    return data.suggestions;
  }

  async generateStory(context: SessionStoryContext): Promise<string> {
    const { data, error } = await this.supabase.functions.invoke('generate-session-suggestions', {
      body: {
        action: 'summary',
        context: this.withAssistantSettings({
          ...context,
          goal: 'A Session fontos pillanatainak megőrzése.',
          recentEvents: context.events,
          userContext: '',
        }),
      },
    });
    if (error) throw new Error(await describeFunctionError(error));
    if (!isStoryResponse(data)) throw new Error('Az AI segítő hibás választ adott.');
    return data.summary;
  }

  private withAssistantSettings<T extends object>(context: T): T & { assistantProfile: unknown } {
    const settings = this.assistantSettings.settings();
    const connection = this.assistantSettings.requestConfiguration();
    if (!settings.enabled) {
      throw new Error('Az AI kreatív társ ki van kapcsolva a beállításokban.');
    }
    if (!connection.apiKey) {
      throw new Error('Add meg az AI szolgáltató API-kulcsát a Kalandsegítő beállításaiban.');
    }
    return {
      ...context,
      assistantProfile: {
        enabled: settings.enabled,
        name: settings.name,
        tone: settings.tone,
        proactive: settings.proactive,
        guidance: settings.guidance,
      },
      aiConnection: connection,
    };
  }
}

async function describeFunctionError(error: unknown): Promise<string> {
  if (typeof error === 'object' && error !== null && 'context' in error) {
    const context = (error as { context?: { clone?: () => Response } }).context;
    try {
      const body = await context?.clone?.().json() as { error?: unknown };
      if (typeof body?.error === 'string' && body.error.trim()) return body.error;
    } catch {
      // Fall through to the generic message when the function did not return JSON.
    }
  }
  return 'Az AI segítő most nem érhető el.';
}

function isStoryResponse(data: unknown): data is { summary: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'summary' in data &&
    typeof data.summary === 'string'
  );
}

function isSuggestionResponse(
  data: unknown,
): data is { suggestions: SessionAssistantSuggestion[] } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'suggestions' in data &&
    Array.isArray(data.suggestions)
  );
}

function isFoundationSuggestionResponse(
  data: unknown,
): data is { suggestions: AdventureFoundationSuggestion[] } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'suggestions' in data &&
    Array.isArray(data.suggestions) &&
    data.suggestions.every(
      (suggestion) =>
        typeof suggestion === 'object' &&
        suggestion !== null &&
        'title' in suggestion &&
        typeof suggestion.title === 'string' &&
        'premise' in suggestion &&
        typeof suggestion.premise === 'string',
    )
  );
}

function isSceneSuggestionResponse(
  data: unknown,
): data is { suggestions: AdventureSceneSuggestion[] } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'suggestions' in data &&
    Array.isArray(data.suggestions) &&
    data.suggestions.every(
      (suggestion) =>
        typeof suggestion === 'object' &&
        suggestion !== null &&
        'title' in suggestion &&
        typeof suggestion.title === 'string' &&
        'description' in suggestion &&
        typeof suggestion.description === 'string' &&
        'goal' in suggestion &&
        typeof suggestion.goal === 'string',
    )
  );
}

function isAdventureStorySuggestionResponse(
  data: unknown,
): data is { suggestions: AdventureStorySuggestion[] } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'suggestions' in data &&
    Array.isArray(data.suggestions) &&
    data.suggestions.every(
      (suggestion) =>
        typeof suggestion === 'object' &&
        suggestion !== null &&
        'opening' in suggestion &&
        typeof suggestion.opening === 'string' &&
        'development' in suggestion &&
        typeof suggestion.development === 'string' &&
        'climax' in suggestion &&
        typeof suggestion.climax === 'string' &&
        'resolution' in suggestion &&
        typeof suggestion.resolution === 'string',
    )
  );
}
