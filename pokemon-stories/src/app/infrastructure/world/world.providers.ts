import type { Provider } from '@angular/core';

import { WORLD_FACT_REPOSITORY } from '../../application/world/tokens/world-fact.tokens';
import { SupabaseWorldFactRepository } from './repositories/supabase-world-fact.repository';

export function provideWorldInfrastructure(): Provider[] {
  return [
    SupabaseWorldFactRepository,
    { provide: WORLD_FACT_REPOSITORY, useExisting: SupabaseWorldFactRepository },
  ];
}
