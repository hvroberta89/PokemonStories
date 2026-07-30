import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { AdventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

export interface AdventurePlanReader {
  findById(
    id: AdventurePlanId,
  ): Promise<AdventurePlan | undefined>;

  findByProjectId(
    projectId: ProjectId,
  ): Promise<readonly AdventurePlan[]>;
}