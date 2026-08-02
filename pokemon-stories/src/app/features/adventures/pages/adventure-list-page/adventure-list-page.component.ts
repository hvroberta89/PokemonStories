import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

import { AdventurePlanSummary } from '../../../../application/adventure/queries/models/adventure-plan-summary';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { AdventureListStore } from '../../store/adventure-list.store';

@Component({
  selector: 'app-adventure-list-page',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, PsIconComponent],
  templateUrl: './adventure-list-page.component.html',
  styleUrl: './adventure-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdventureListStore],
})
export class AdventureListPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly projectId = projectId(this.route.snapshot.paramMap.get('projectId') ?? '');
  protected readonly store = inject(AdventureListStore);

  constructor() {
    void this.store.load(this.projectId);
  }

  protected trackAdventure(_: number, adventure: AdventurePlanSummary): string {
    return adventure.id;
  }

  protected retry(): void {
    void this.store.load(this.projectId);
  }
}
