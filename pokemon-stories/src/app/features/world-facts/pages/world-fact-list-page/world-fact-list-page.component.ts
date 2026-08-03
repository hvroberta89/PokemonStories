import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { projectId } from '../../../../domain/project/value-objects/project-id';
import type { WorldFact, WorldFactCategory } from '../../../../domain/world/models/world-fact';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { WorldFactListStore } from '../../store/world-fact-list.store';
import { findPotentialWorldFactConflict } from '../../world-fact-conflict-detector';

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
  protected readonly factToReplace = signal<WorldFact | null>(null);
  protected readonly replacementText = signal('');
  protected readonly potentialConflict = signal<WorldFact | null>(null);

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
    const conflict = findPotentialWorldFactConflict(
      this.store.activeFacts(),
      this.text(),
      this.category(),
    );
    if (conflict) {
      this.potentialConflict.set(conflict);
      return;
    }
    await this.createWithoutConflict();
  }

  protected async keepBoth(): Promise<void> {
    this.potentialConflict.set(null);
    await this.createWithoutConflict();
  }

  protected editProposal(): void {
    this.potentialConflict.set(null);
  }

  protected cancelProposal(): void {
    this.potentialConflict.set(null);
    this.dialogOpen.set(false);
  }

  protected async replacePotentialConflict(): Promise<void> {
    const fact = this.potentialConflict();
    if (!fact || !(await this.store.replace(fact, this.text()))) return;
    this.potentialConflict.set(null);
    this.dialogOpen.set(false);
    this.text.set('');
    this.category.set('general');
  }

  protected startReplacing(fact: WorldFact): void {
    this.factToReplace.set(fact);
    this.replacementText.set(fact.value.text);
  }

  protected updateReplacementText(event: Event): void {
    this.replacementText.set((event.target as HTMLTextAreaElement).value);
  }

  protected async replace(): Promise<void> {
    const fact = this.factToReplace();
    if (fact && (await this.store.replace(fact, this.replacementText()))) {
      this.factToReplace.set(null);
      this.replacementText.set('');
    }
  }

  private async createWithoutConflict(): Promise<void> {
    if (!(await this.store.create(this.projectId, this.text(), this.category()))) return;
    this.dialogOpen.set(false);
    this.text.set('');
    this.category.set('general');
  }
}
