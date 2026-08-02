import { computed, inject, Injectable, signal } from '@angular/core';

import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import { REWARD_GRANT_REPOSITORY } from '../../../application/reward/tokens/reward-grant.tokens';
import type { RewardGrant, RewardType } from '../../../domain/reward/models/reward-grant';
import { projectId } from '../../../domain/project/value-objects/project-id';

export type CollectionStatus = 'idle' | 'loading' | 'loaded' | 'not-found' | 'error';
export type CollectionDeliveryFilter = 'all' | 'pending' | 'given';

@Injectable()
export class ProjectCollectionStore {
  private readonly projects = inject(PROJECT_READER);
  private readonly rewards = inject(REWARD_GRANT_REPOSITORY);
  private readonly statusState = signal<CollectionStatus>('idle');
  private readonly projectNameState = signal('');
  private readonly grantsState = signal<readonly RewardGrant[]>([]);
  readonly typeFilter = signal<RewardType | 'all'>('all');
  readonly recipientFilter = signal('all');
  readonly deliveryFilter = signal<CollectionDeliveryFilter>('all');

  readonly status = this.statusState.asReadonly();
  readonly projectName = this.projectNameState.asReadonly();
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isNotFound = computed(() => this.status() === 'not-found');
  readonly hasError = computed(() => this.status() === 'error');
  readonly recipients = computed(() => {
    const recipients = new Map<string, string>();
    for (const grant of this.grantsState()) {
      recipients.set(
        grant.value.recipientId ?? `scope:${grant.value.recipientName}`,
        grant.value.recipientName,
      );
    }
    return [...recipients]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'hu'));
  });
  readonly grants = computed(() =>
    this.grantsState().filter(({ value }) => {
      const typeMatches = this.typeFilter() === 'all' || value.type === this.typeFilter();
      const recipientMatches =
        this.recipientFilter() === 'all' ||
        (value.recipientId ?? `scope:${value.recipientName}`) === this.recipientFilter();
      const deliveryMatches =
        this.deliveryFilter() === 'all' || value.deliveryStatus === this.deliveryFilter();
      return typeMatches && recipientMatches && deliveryMatches;
    }),
  );
  readonly totalCount = computed(() => this.grantsState().length);
  readonly latestSessionGrants = computed(() => {
    const grants = this.grantsState();
    const latestSessionId = grants[0]?.value.sessionId;
    return latestSessionId
      ? grants.filter((grant) => grant.value.sessionId === latestSessionId)
      : [];
  });
  readonly latestSessionCount = computed(() => this.latestSessionGrants().length);
  readonly pendingCount = computed(
    () => this.grantsState().filter((grant) => grant.value.deliveryStatus === 'pending').length,
  );
  readonly givenCount = computed(() => this.totalCount() - this.pendingCount());

  async load(rawProjectId: string): Promise<void> {
    this.statusState.set('loading');
    try {
      const id = projectId(rawProjectId);
      const project = await this.projects.findById(id);
      if (!project || project.status === 'archived') {
        this.statusState.set('not-found');
        return;
      }
      this.projectNameState.set(project.name);
      this.grantsState.set(await this.rewards.findByProject(id));
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }
}
