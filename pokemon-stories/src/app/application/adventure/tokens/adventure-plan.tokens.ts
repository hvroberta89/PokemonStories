import { InjectionToken } from '@angular/core';

import { AdventurePlanReader } from '../ports/adventure-plan-reader';
import { AdventurePlanRepository } from '../ports/adventure-plan-repository';

export const ADVENTURE_PLAN_READER = new InjectionToken<AdventurePlanReader>(
  'ADVENTURE_PLAN_READER',
);

export const ADVENTURE_PLAN_REPOSITORY = new InjectionToken<AdventurePlanRepository>(
  'ADVENTURE_PLAN_REPOSITORY',
);
