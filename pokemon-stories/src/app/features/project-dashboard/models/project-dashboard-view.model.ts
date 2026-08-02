import { AdventurePlanSummary } from '../../../application/adventure/queries/models/adventure-plan-summary';
import { ProjectSummary } from '../../../application/project/queries/models/project-summary';
import { ProjectSessionSummary } from '../../../application/session/ports/project-session-reader';

export type DashboardPrimaryAction =
  | { readonly kind: 'resume-session'; readonly session: ProjectSessionSummary }
  | { readonly kind: 'review-session'; readonly session: ProjectSessionSummary }
  | { readonly kind: 'create-adventure' }
  | { readonly kind: 'continue-adventure'; readonly adventure: AdventurePlanSummary }
  | { readonly kind: 'prepare-adventure'; readonly adventure: AdventurePlanSummary };

export interface ProjectDashboardViewModel {
  readonly project: ProjectSummary;
  readonly primaryAction: DashboardPrimaryAction;
  readonly adventureCount: number;
}
