import { AdventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';

export interface UpdateAdventureStoryCommand {
  readonly projectId: ProjectId;
  readonly adventurePlanId: AdventurePlanId;
  readonly opening?: string;
  readonly development?: string;
  readonly climax?: string;
  readonly resolution?: string;
}
