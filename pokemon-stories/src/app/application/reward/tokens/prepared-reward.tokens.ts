import { InjectionToken } from '@angular/core';
import type { PreparedRewardRepository } from '../ports/prepared-reward-repository';

export const PREPARED_REWARD_REPOSITORY = new InjectionToken<PreparedRewardRepository>(
  'PREPARED_REWARD_REPOSITORY',
  { providedIn: 'root', factory: () => ({ save: async () => undefined, findByAdventure: async () => [], remove: async () => undefined, markUnlocked: async () => undefined }) },
);
