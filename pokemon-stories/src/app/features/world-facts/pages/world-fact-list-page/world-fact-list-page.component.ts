import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { projectId } from '../../../../domain/project/value-objects/project-id';
import type { WorldFactCategory } from '../../../../domain/world/models/world-fact';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { WorldFactListStore } from '../../store/world-fact-list.store';

@Component({
  selector: 'app-world-fact-list-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent],
  templateUrl: './world-fact-list-page.component.html',
  styleUrl: './world-fact-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WorldFactListStore],
})
export class WorldFactListPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly projectId = projectId(this.route.snapshot.paramMap.get('projectId') ?? '');
  protected readonly store = inject(WorldFactListStore);
  protected readonly dialogOpen = signal(false);
  protected readonly text = signal('');
  protected readonly category = signal<WorldFactCategory>('general');

  constructor() {
    void this.store.load(this.projectId);
  }

  protected updateText(event: Event): void {
    this.text.set((event.target as HTMLTextAreaElement).value);
  }
  protected updateCategory(event: Event): void {
    this.category.set((event.target as HTMLSelectElement).value as WorldFactCategory);
  }
  protected async create(): Promise<void> {
    if (await this.store.create(this.projectId, this.text(), this.category())) {
      this.dialogOpen.set(false);
      this.text.set('');
      this.category.set('general');
    }
  }
}
