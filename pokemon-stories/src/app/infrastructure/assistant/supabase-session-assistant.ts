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

@Injectable()
export class SupabaseSessionAssistant implements SessionAssistant, AdventureAssistant {
  private readonly supabase = inject(SUPABASE_CLIENT);

  async generateFoundationSuggestions(
    context: AdventureFoundationContext,
  ): Promise<readonly AdventureFoundationSuggestion[]> {
    const { data, error } = await this.supabase.functions.invoke('generate-session-suggestions', {
      body: { action: 'foundation', context },
    });
    if (error) throw new Error('Az AI segítő most nem érhető el.');
    if (!isFoundationSuggestionResponse(data)) throw new Error('Az AI segítő hibás választ adott.');
    return data.suggestions;
  }

  async generateSceneSuggestions(
    context: AdventureSceneSuggestionContext,
  ): Promise<readonly AdventureSceneSuggestion[]> {
    const { data, error } = await this.supabase.functions.invoke('generate-session-suggestions', {
      body: { action: 'scene', context },
    });
    if (error) throw new Error('Az AI segítő most nem érhető el.');
    if (!isSceneSuggestionResponse(data)) throw new Error('Az AI segítő hibás választ adott.');
    return data.suggestions;
  }

  async generateStorySuggestions(
    context: AdventureStorySuggestionContext,
  ): Promise<readonly AdventureStorySuggestion[]> {
    const { data, error } = await this.supabase.functions.invoke('generate-session-suggestions', {
      body: { action: 'adventure-story', context },
    });
    if (error) throw new Error('Az AI segítő most nem érhető el.');
    if (!isAdventureStorySuggestionResponse(data)) throw new Error('Az AI segítő hibás választ adott.');
    return data.suggestions;
  }

  async generate(
    action: SessionAssistantAction,
    context: SessionAssistantContext,
  ): Promise<readonly SessionAssistantSuggestion[]> {
    const { data, error } = await this.supabase.functions.invoke('generate-session-suggestions', {
      body: { action, context },
    });
    if (error) throw new Error('Az AI segítő most nem érhető el.');
    if (!isSuggestionResponse(data)) throw new Error('Az AI segítő hibás választ adott.');
    return data.suggestions;
  }

  async generateStory(context: SessionStoryContext): Promise<string> {
    const { data, error } = await this.supabase.functions.invoke('generate-session-suggestions', {
      body: {
        action: 'summary',
        context: {
          ...context,
          goal: 'A Session fontos pillanatainak megőrzése.',
          recentEvents: context.events,
          userContext: '',
        },
      },
    });
    if (error) throw new Error('Az AI segítő most nem érhető el.');
    if (!isStoryResponse(data)) throw new Error('Az AI segítő hibás választ adott.');
    return data.summary;
  }
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
