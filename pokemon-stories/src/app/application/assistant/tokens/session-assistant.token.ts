import { InjectionToken } from '@angular/core';

import type { SessionAssistant } from '../ports/session-assistant';

export const SESSION_ASSISTANT = new InjectionToken<SessionAssistant>('SESSION_ASSISTANT');
