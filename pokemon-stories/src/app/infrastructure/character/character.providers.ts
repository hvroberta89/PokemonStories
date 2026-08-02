import { Provider } from '@angular/core';
import {
  CHARACTER_READER,
  CHARACTER_REPOSITORY,
} from '../../application/character/tokens/character.tokens';
import { InMemoryCharacterRepository } from './repositories/in-memory-character.repository';

export function provideCharacterInfrastructure(): Provider[] {
  return [
    InMemoryCharacterRepository,
    { provide: CHARACTER_READER, useExisting: InMemoryCharacterRepository },
    { provide: CHARACTER_REPOSITORY, useExisting: InMemoryCharacterRepository },
  ];
}
