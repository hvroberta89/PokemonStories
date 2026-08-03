import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
  protected readonly archiveTarget = signal<AdventurePlanSummary | null>(null);
  protected readonly archiveError = signal<string | null>(null);

  constructor() {
    void this.store.load(this.projectId);
  }

  protected trackAdventure(_: number, adventure: AdventurePlanSummary): string {
    return adventure.id;
  }

  protected retry(): void {
    void this.store.load(this.projectId);
  }

  protected requestArchive(adventure: AdventurePlanSummary): void {
    this.archiveError.set(null);
    this.archiveTarget.set(adventure);
  }

  protected async archiveAdventure(): Promise<void> {
    const adventure = this.archiveTarget();
    if (!adventure) return;
    const result = await this.store.archive(adventure.id);
    if (result === 'archived') {
      this.archiveTarget.set(null);
      return;
    }
    this.archiveError.set(
      result === 'active-session'
        ? 'A futó vagy átnézésre váró Sessiont előbb fejezd be.'
        : 'A kaland archiválása most nem sikerült.',
    );
  }
}
