import type { Provider } from '@angular/core';

import { REWARD_GRANT_REPOSITORY } from '../../application/reward/tokens/reward-grant.tokens';
import { SupabaseRewardGrantRepository } from './repositories/supabase-reward-grant.repository';

export function provideRewardInfrastructure(): Provider[] {
  return [
    SupabaseRewardGrantRepository,
    { provide: REWARD_GRANT_REPOSITORY, useExisting: SupabaseRewardGrantRepository },
  ];
}
