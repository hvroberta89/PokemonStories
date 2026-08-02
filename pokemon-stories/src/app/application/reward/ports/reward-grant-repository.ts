import type { RewardGrant } from '../../../domain/reward/models/reward-grant';
import type { ProjectId } from '../../../domain/project/value-objects/project-id';

export interface RewardGrantRepository {
  saveAll(grants: readonly RewardGrant[]): Promise<void>;
  findByProject(projectId: ProjectId): Promise<readonly RewardGrant[]>;
  findById(projectId: ProjectId, rewardId: string): Promise<RewardGrant | undefined>;
}
