import { AudienceProfile } from '../../../../domain/audience/models/audience-profile';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';

export interface CreateAdventurePlanCommand {
  readonly projectId: ProjectId;
  readonly title: string;
  readonly premise: string;
  readonly audienceProfile: AudienceProfile;
}