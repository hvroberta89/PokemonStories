import { computed, inject, Injectable, signal } from '@angular/core';

import { CreateLocationHandler } from '../../../application/location/commands/create-location/create-location.handler';
import { LOCATION_REPOSITORY } from '../../../application/location/tokens/location.tokens';
import { ID_GENERATOR } from '../../../application/project/tokens/id-generator.token';
import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import type { Location, LocationType } from '../../../domain/location/models/location';
import type { ProjectId } from '../../../domain/project/value-objects/project-id';

type LocationListStatus = 'idle' | 'loading' | 'loaded' | 'not-found' | 'error';

@Injectable()
export class LocationListStore {
  private readonly projectReader = inject(PROJECT_READER);
  private readonly repository = inject(LOCATION_REPOSITORY);
  private readonly createLocation = new CreateLocationHandler(
    async (projectId) => Boolean(await this.projectReader.findById(projectId)),
    this.repository,
    inject(ID_GENERATOR),
  );
  private readonly statusState = signal<LocationListStatus>('idle');
  private readonly projectNameState = signal('');
  private readonly locationsState = signal<readonly Location[]>([]);
  private readonly savingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly projectName = this.projectNameState.asReadonly();
  readonly locations = this.locationsState.asReadonly();
  readonly activeLocations = computed(() =>
    this.locations().filter((location) => location.value.status === 'active'),
  );
  readonly archivedLocations = computed(() =>
    this.locations().filter((location) => location.value.status === 'archived'),
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
      this.locationsState.set(await this.repository.findByProject(projectId));
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }

  async create(
    projectId: ProjectId,
    name: string,
    description: string,
    type: LocationType,
  ): Promise<boolean> {
    this.savingState.set(true);
    this.errorState.set(null);
    try {
      const result = await this.createLocation.execute({ projectId, name, description, type });
      if (!result.isSuccess) {
        this.errorState.set('Adj meg egy érvényes helyszínnevet és rövid leírást.');
        return false;
      }
      this.locationsState.set(await this.repository.findByProject(projectId));
      return true;
    } catch {
      this.errorState.set('A helyszínt most nem sikerült elmenteni.');
      return false;
    } finally {
      this.savingState.set(false);
    }
  }
}
