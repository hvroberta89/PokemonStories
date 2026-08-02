import { Provider } from '@angular/core';

import { PROJECT_SESSION_READER } from '../../application/session/tokens/project-session.tokens';
import { SESSION_CLOUD_REPOSITORY } from '../../application/session/tokens/session-cloud-repository.token';
import { SupabaseSessionRepository } from './repositories/supabase-session.repository';

export function provideSessionInfrastructure(): Provider[] {
  return [
    SupabaseSessionRepository,
    { provide: PROJECT_SESSION_READER, useExisting: SupabaseSessionRepository },
    { provide: SESSION_CLOUD_REPOSITORY, useExisting: SupabaseSessionRepository },
  ];
}
