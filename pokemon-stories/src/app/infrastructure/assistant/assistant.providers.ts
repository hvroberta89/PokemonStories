import type { Provider } from '@angular/core';

import { ADVENTURE_ASSISTANT } from '../../application/assistant/tokens/adventure-assistant.token';
import { SESSION_ASSISTANT } from '../../application/assistant/tokens/session-assistant.token';
import { SupabaseSessionAssistant } from './supabase-session-assistant';

export function provideAssistantInfrastructure(): Provider[] {
  return [
    SupabaseSessionAssistant,
    { provide: SESSION_ASSISTANT, useExisting: SupabaseSessionAssistant },
    { provide: ADVENTURE_ASSISTANT, useExisting: SupabaseSessionAssistant },
  ];
}
