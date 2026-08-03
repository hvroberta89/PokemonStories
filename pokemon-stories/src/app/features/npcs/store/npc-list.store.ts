import { computed, inject, Injectable, signal } from '@angular/core';

import { ArchiveNpcHandler } from '../../../application/npc/commands/archive-npc/archive-npc.handler';
import { CreateNpcHandler } from '../../../application/npc/commands/create-npc/create-npc.handler';
import { NPC_REPOSITORY } from '../../../application/npc/tokens/npc.tokens';
import { ID_GENERATOR } from '../../../application/project/tokens/id-generator.token';
import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import type { Npc } from '../../../domain/npc/models/npc';
import type { ProjectId } from '../../../domain/project/value-objects/project-id';

type NpcListStatus = 'idle' | 'loading' | 'loaded' | 'not-found' | 'error';

@Injectable()
export class NpcListStore {
  private readonly projectReader = inject(PROJECT_READER);
  private readonly repository = inject(NPC_REPOSITORY);
  private readonly createNpc = new CreateNpcHandler(
    async (projectId) => Boolean(await this.projectReader.findById(projectId)),
    this.repository,
    inject(ID_GENERATOR),
  );
  private readonly archiveNpc = new ArchiveNpcHandler(this.repository);
  private readonly statusState = signal<NpcListStatus>('idle');
  private readonly projectNameState = signal('');
  private readonly npcsState = signal<readonly Npc[]>([]);
  private readonly savingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly projectName = this.projectNameState.asReadonly();
  readonly npcs = this.npcsState.asReadonly();
  readonly activeNpcs = computed(() => this.npcs().filter((npc) => npc.value.status === 'active'));
  readonly archivedNpcs = computed(() =>
    this.npcs().filter((npc) => npc.value.status === 'archived'),
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
      this.npcsState.set(await this.repository.findByProject(projectId));
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }

  async create(
    projectId: ProjectId,
    name: string,
    role: string,
    description: string,
  ): Promise<boolean> {
    this.savingState.set(true);
    this.errorState.set(null);
    try {
      const result = await this.createNpc.execute({ projectId, name, role, description });
      if (!result.isSuccess) {
        this.errorState.set('Adj meg egy érvényes nevet és szerepet az NPC-nek.');
        return false;
      }
      this.npcsState.set(await this.repository.findByProject(projectId));
      return true;
    } catch {
      this.errorState.set('Az NPC-t most nem sikerült elmenteni.');
      return false;
    } finally {
      this.savingState.set(false);
    }
  }

  async archive(npc: Npc): Promise<void> {
    this.savingState.set(true);
    this.errorState.set(null);
    try {
      const archivedNpc = await this.archiveNpc.execute(npc);
      this.npcsState.update((npcs) =>
        npcs.map((item) => (item.value.id === npc.value.id ? archivedNpc : item)),
      );
    } catch {
      this.errorState.set('Az NPC-t most nem sikerült archiválni.');
    } finally {
      this.savingState.set(false);
    }
  }
}
