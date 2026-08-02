import { Provider } from '@angular/core';

import {
  PROJECT_READER,
  PROJECT_REPOSITORY,
} from '../../application/project/tokens/project.tokens';

import { CryptoIdGenerator } from '../shared/identifiers/crypto-id.generator';
import { SupabaseProjectRepository } from './repositories/supabase-project.repository';
import { ID_GENERATOR } from '../../application/project/tokens/id-generator.token';
import { ACTIVE_PROJECT_STORAGE } from '../../application/project/tokens/active-project-storage.token';
import { LocalActiveProjectStorage } from './storage/local-active-project.storage';

export function provideProjectInfrastructure(): Provider[] {
  return [
    SupabaseProjectRepository,
    {
      provide: PROJECT_REPOSITORY,
      useExisting: SupabaseProjectRepository,
    },
    {
      provide: PROJECT_READER,
      useExisting: SupabaseProjectRepository,
    },
    {
      provide: ID_GENERATOR,
      useClass: CryptoIdGenerator,
    },
    LocalActiveProjectStorage,
    {
      provide: ACTIVE_PROJECT_STORAGE,
      useExisting: LocalActiveProjectStorage,
    },
  ];
}
