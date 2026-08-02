import { Provider } from '@angular/core';

import {
  ADVENTURE_PLAN_READER,
  ADVENTURE_PLAN_REPOSITORY,
} from '../../application/adventure/tokens/adventure-plan.tokens';
import { InMemoryAdventurePlanRepository } from './repositories/in-memory-adventure-plan.repository';

export function provideAdventureInfrastructure(): Provider[] {
  return [
    InMemoryAdventurePlanRepository,
    {
      provide: ADVENTURE_PLAN_READER,
      useExisting: InMemoryAdventurePlanRepository,
    },
    {
      provide: ADVENTURE_PLAN_REPOSITORY,
      useExisting: InMemoryAdventurePlanRepository,
    },
  ];
}
