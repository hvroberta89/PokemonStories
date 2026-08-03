import type { AdventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import type { ProjectId } from '../../../domain/project/value-objects/project-id';
import type { PreparedReward } from '../../../domain/reward/models/prepared-reward';

export interface PreparedRewardRepository {
  save(reward: PreparedReward): Promise<void>;
  findByAdventure(projectId: ProjectId, adventureId: AdventurePlanId): Promise<readonly PreparedReward[]>;
  remove(projectId: ProjectId, rewardId: string): Promise<void>;
  markUnlocked(projectId: ProjectId, rewardIds: readonly string[], sessionId: string): Promise<void>;
}
