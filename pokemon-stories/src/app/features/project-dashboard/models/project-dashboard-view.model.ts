import { AdventurePlanSummary } from '../../../application/adventure/queries/models/adventure-plan-summary';
import { ProjectSummary } from '../../../application/project/queries/models/project-summary';

export type DashboardPrimaryAction =
  | { readonly kind: 'create-adventure' }
  | { readonly kind: 'continue-adventure'; readonly adventure: AdventurePlanSummary }
  | { readonly kind: 'prepare-adventure'; readonly adventure: AdventurePlanSummary };

export interface ProjectDashboardViewModel {
  readonly project: ProjectSummary;
  readonly primaryAction: DashboardPrimaryAction;
  readonly adventureCount: number;
}
