import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ProjectSummary } from '../../../../application/project/queries/models/project-summary';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [PsIconComponent],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  readonly project = input.required<ProjectSummary>();
  readonly openProject = output<void>();
}
