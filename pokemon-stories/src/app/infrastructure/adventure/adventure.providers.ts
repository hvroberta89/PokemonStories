import { Provider } from '@angular/core';

import {
  ADVENTURE_PLAN_READER,
  ADVENTURE_PLAN_REPOSITORY,
} from '../../application/adventure/tokens/adventure-plan.tokens';
import { SupabaseAdventurePlanRepository } from './repositories/supabase-adventure-plan.repository';

export function provideAdventureInfrastructure(): Provider[] {
  return [
    SupabaseAdventurePlanRepository,
    {
      provide: ADVENTURE_PLAN_READER,
      useExisting: SupabaseAdventurePlanRepository,
    },
    {
      provide: ADVENTURE_PLAN_REPOSITORY,
      useExisting: SupabaseAdventurePlanRepository,
    },
  ];
}
