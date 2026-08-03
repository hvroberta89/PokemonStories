import { inject, Injectable } from '@angular/core';

import type {
  SessionAssistant,
  SessionAssistantAction,
  SessionAssistantContext,
  SessionAssistantSuggestion,
  SessionStoryContext,
} from '../../application/assistant/ports/session-assistant';
import { SUPABASE_CLIENT } from '../supabase/supabase-client.token';

@Injectable()
export class SupabaseSessionAssistant implements SessionAssistant {
  private readonly supabase = inject(SUPABASE_CLIENT);

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
