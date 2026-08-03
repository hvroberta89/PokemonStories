import { InjectionToken } from '@angular/core';

import type { AdventureAssistant } from '../ports/adventure-assistant';

export const ADVENTURE_ASSISTANT = new InjectionToken<AdventureAssistant>('ADVENTURE_ASSISTANT');