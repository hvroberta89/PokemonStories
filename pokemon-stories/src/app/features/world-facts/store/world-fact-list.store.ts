import { computed, inject, Injectable, signal } from '@angular/core';

import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import { WORLD_FACT_REPOSITORY } from '../../../application/world/tokens/world-fact.tokens';
import type { ProjectId } from '../../../domain/project/value-objects/project-id';
import { WorldFact, type WorldFactCategory } from '../../../domain/world/models/world-fact';

type WorldFactListStatus = 'idle' | 'loading' | 'loaded' | 'not-found' | 'error';

@Injectable()
export class WorldFactListStore {
  private readonly projectReader = inject(PROJECT_READER);
  private readonly repository = inject(WORLD_FACT_REPOSITORY);
  private readonly statusState = signal<WorldFactListStatus>('idle');
  private readonly projectNameState = signal('');
  private readonly factsState = signal<readonly WorldFact[]>([]);
  private readonly savingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly projectName = this.projectNameState.asReadonly();
  readonly facts = this.factsState.asReadonly();
  readonly activeFacts = computed(() =>
    this.facts().filter((fact) => fact.value.status === 'active'),
  );
  readonly archivedFacts = computed(() =>
    this.facts().filter((fact) => fact.value.status === 'archived'),
  );
  readonly saving = this.savingState.asReadonly();
  readonly errorMessage = this.errorState.asReadonly();
  readonly isLoading = computed(() => this.statusState() === 'loading');
  readonly isNotFound = computed(() => this.statusState() === 'not-found');
  readonly hasError = computed(() => this.statusState() === 'error');

  async load(projectId: ProjectId): Promise<void> {
    this.statusState.set('loading');
    try {
      const project = await this.projectReader.findById(projectId);
      if (!project || project.status === 'archived') {
        this.statusState.set('not-found');
        return;
      }
      this.projectNameState.set(project.name);
      this.factsState.set(await this.repository.findByProject(projectId));
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }

  async create(projectId: ProjectId, text: string, category: WorldFactCategory): Promise<boolean> {
    this.savingState.set(true);
    this.errorState.set(null);
    try {
      await this.repository.save(
        WorldFact.create({ id: crypto.randomUUID(), projectId, text, category }),
      );
      this.factsState.set(await this.repository.findByProject(projectId));
      return true;
    } catch (error) {
      this.errorState.set(
        error instanceof Error ? error.message : 'A Világtényt nem sikerült elmenteni.',
      );
      return false;
    } finally {
      this.savingState.set(false);
    }
  }

  async archive(fact: WorldFact): Promise<void> {
    this.savingState.set(true);
    this.errorState.set(null);
    try {
      await this.repository.save(fact.archive());
      this.factsState.update((facts) =>
        facts.map((item) => (item.value.id === fact.value.id ? fact.archive() : item)),
      );
    } catch {
      this.errorState.set('A Világtényt nem sikerült archiválni.');
    } finally {
      this.savingState.set(false);
    }
  }
}
