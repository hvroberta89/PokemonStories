import { AdventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';

export interface GetAdventurePlanQuery {
  readonly projectId: ProjectId;
  readonly adventurePlanId: AdventurePlanId;
}
