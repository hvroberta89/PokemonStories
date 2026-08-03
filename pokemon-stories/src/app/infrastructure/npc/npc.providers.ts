import type { Provider } from '@angular/core';

import { NPC_REPOSITORY } from '../../application/npc/tokens/npc.tokens';
import { SupabaseNpcRepository } from './repositories/supabase-npc.repository';

export function provideNpcInfrastructure(): Provider[] {
  return [SupabaseNpcRepository, { provide: NPC_REPOSITORY, useExisting: SupabaseNpcRepository }];
}
