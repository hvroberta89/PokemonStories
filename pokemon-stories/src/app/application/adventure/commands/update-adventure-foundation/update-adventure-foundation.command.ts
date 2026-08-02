import { AudienceProfile } from '../../../../domain/audience/models/audience-profile';
import { AdventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';

export interface UpdateAdventureFoundationCommand {
  readonly projectId: ProjectId;
  readonly adventurePlanId: AdventurePlanId;
  readonly title: string;
  readonly premise: string;
  readonly audienceProfile: AudienceProfile;
}
