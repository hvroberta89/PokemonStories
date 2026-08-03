import { InjectionToken } from '@angular/core';

import type { NpcRepository } from '../ports/npc-repository';

export const NPC_REPOSITORY = new InjectionToken<NpcRepository>('NPC_REPOSITORY');
