import type { Provider } from '@angular/core';

import { SESSION_ASSISTANT } from '../../application/assistant/tokens/session-assistant.token';
import { SupabaseSessionAssistant } from './supabase-session-assistant';

export function provideAssistantInfrastructure(): Provider[] {
  return [
    SupabaseSessionAssistant,
    { provide: SESSION_ASSISTANT, useExisting: SupabaseSessionAssistant },
  ];
}
