import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { AdventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

export interface AdventurePlanRepository {
  save(adventurePlan: AdventurePlan): Promise<void>;

  findById(
    id: AdventurePlanId,
  ): Promise<AdventurePlan | undefined>;

  findByProjectId(
    projectId: ProjectId,
  ): Promise<readonly AdventurePlan[]>;

  existsByTitle(
    projectId: ProjectId,
    title: string,
  ): Promise<boolean>;
}