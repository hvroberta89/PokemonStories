import { InjectionToken } from '@angular/core';

import type { WorldFactRepository } from '../ports/world-fact-repository';

export const WORLD_FACT_REPOSITORY = new InjectionToken<WorldFactRepository>(
  'WORLD_FACT_REPOSITORY',
);
