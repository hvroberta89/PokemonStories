import { ProjectId } from '../../../../domain/project/value-objects/project-id';

export interface ListAdventurePlansByProjectQuery {
  readonly projectId: ProjectId;
}