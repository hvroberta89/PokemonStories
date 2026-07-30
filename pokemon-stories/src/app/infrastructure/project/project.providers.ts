import { Provider } from '@angular/core';

import {
  PROJECT_READER,
  PROJECT_REPOSITORY,
} from '../../application/project/tokens/project.tokens';

import { CryptoIdGenerator } from '../shared/identifiers/crypto-id.generator';
import { InMemoryProjectRepository } from './repositories/in-memory-project.repository';
import { ID_GENERATOR } from '../../application/project/tokens/id-generator.token';

export function provideProjectInfrastructure(): Provider[] {
  return [
    InMemoryProjectRepository,
    {
      provide: PROJECT_REPOSITORY,
      useExisting: InMemoryProjectRepository,
    },
    {
      provide: PROJECT_READER,
      useExisting: InMemoryProjectRepository,
    },
    {
      provide: ID_GENERATOR,
      useClass: CryptoIdGenerator,
    },
  ];
}