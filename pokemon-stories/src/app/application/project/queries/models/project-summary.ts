import { ProjectStatus } from '../../../../domain/project/models/project-status';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';

export interface ProjectSummary {
  readonly id: ProjectId;
  readonly name: string;
  readonly description?: string;
  readonly status: ProjectStatus;
}