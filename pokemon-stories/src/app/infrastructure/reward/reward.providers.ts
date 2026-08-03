import type { Provider } from '@angular/core';

import { REWARD_GRANT_REPOSITORY } from '../../application/reward/tokens/reward-grant.tokens';
import { SupabaseRewardGrantRepository } from './repositories/supabase-reward-grant.repository';
import { PREPARED_REWARD_REPOSITORY } from '../../application/reward/tokens/prepared-reward.tokens';
import { SupabasePreparedRewardRepository } from './repositories/supabase-prepared-reward.repository';

export function provideRewardInfrastructure(): Provider[] {
  return [
    SupabaseRewardGrantRepository,
    SupabasePreparedRewardRepository,
    { provide: REWARD_GRANT_REPOSITORY, useExisting: SupabaseRewardGrantRepository },
    { provide: PREPARED_REWARD_REPOSITORY, useExisting: SupabasePreparedRewardRepository },
  ];
}
