import { InjectionToken } from '@angular/core';

import type { RewardGrantRepository } from '../ports/reward-grant-repository';

export const REWARD_GRANT_REPOSITORY = new InjectionToken<RewardGrantRepository>(
  'REWARD_GRANT_REPOSITORY',
  {
    providedIn: 'root',
    factory: () => ({
      saveAll: async () => undefined,
      findByProject: async () => [],
      findById: async () => undefined,
    }),
  },
);
