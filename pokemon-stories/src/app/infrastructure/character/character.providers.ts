import { Provider } from '@angular/core';
import {
  CHARACTER_READER,
  CHARACTER_REPOSITORY,
} from '../../application/character/tokens/character.tokens';
import { SupabaseCharacterRepository } from './repositories/supabase-character.repository';

export function provideCharacterInfrastructure(): Provider[] {
  return [
    SupabaseCharacterRepository,
    { provide: CHARACTER_READER, useExisting: SupabaseCharacterRepository },
    { provide: CHARACTER_REPOSITORY, useExisting: SupabaseCharacterRepository },
  ];
}
