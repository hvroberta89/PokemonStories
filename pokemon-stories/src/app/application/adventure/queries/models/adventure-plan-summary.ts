import { AdventurePlanStatus } from '../../../../domain/adventure/models/adventure-plan-status';
import { AdventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';

export interface AdventurePlanSummary {
  readonly id: AdventurePlanId;
  readonly projectId: ProjectId;
  readonly title: string;
  readonly premise: string;
  readonly status: AdventurePlanStatus;
  readonly minimumAge: number;
  readonly maximumAge: number;
  readonly sessionLengthMinutes: number;
}