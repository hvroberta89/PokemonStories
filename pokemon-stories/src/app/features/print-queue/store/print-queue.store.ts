import { computed, inject, Injectable, signal } from '@angular/core';

import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import { REWARD_GRANT_REPOSITORY } from '../../../application/reward/tokens/reward-grant.tokens';
import type { RewardGrant, RewardType } from '../../../domain/reward/models/reward-grant';
import { projectId } from '../../../domain/project/value-objects/project-id';
import type { RewardHistoryItemViewModel } from '../../running-session/components/reward-history/reward-history.model';
import type { RewardQueueItemViewModel } from '../../running-session/components/reward-queue/reward-queue.model';
import type { PsIconName } from '../../../shared/ui/icon/ps-icon.registry';

type PrintQueueStatus = 'idle' | 'loading' | 'loaded' | 'not-found' | 'error';

@Injectable()
export class PrintQueueStore {
  private readonly projects = inject(PROJECT_READER);
  private readonly rewards = inject(REWARD_GRANT_REPOSITORY);
  private readonly statusState = signal<PrintQueueStatus>('idle');
  private readonly projectNameState = signal('');
  private readonly grantsState = signal<readonly RewardGrant[]>([]);

  readonly projectName = this.projectNameState.asReadonly();
  readonly isLoading = computed(() => this.statusState() === 'loading');
  readonly isNotFound = computed(() => this.statusState() === 'not-found');
  readonly hasError = computed(() => this.statusState() === 'error');
  readonly queueItems = computed<readonly RewardQueueItemViewModel[]>(() =>
    this.grantsState()
      .filter((grant) => grant.value.physicalStatus === 'queued')
      .map((grant) => this.toQueueItem(grant)),
  );
  readonly historyItems = computed<readonly RewardHistoryItemViewModel[]>(() =>
    this.grantsState()
      .filter((grant) => grant.value.physicalStatus === 'printed' || grant.value.deliveryStatus === 'given')
      .map((grant) => ({
        ...this.toQueueItem(grant),
        givenAtLabel: grant.value.deliveryStatus === 'given' ? 'Átadva' : 'Kinyomtatva',
      })),
  );

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

  async markAsPrinted(rewardId: string): Promise<void> {
    const reward = this.grantsState().find((grant) => grant.value.id === rewardId);
    if (!reward || reward.value.physicalStatus !== 'queued') return;
    const updatedReward = reward.updatePhysicalStatus('printed');
    await this.save(updatedReward);
  }

  async markAsGiven(rewardId: string): Promise<void> {
    const reward = this.grantsState().find((grant) => grant.value.id === rewardId);
    if (!reward || reward.value.deliveryStatus === 'given') return;
    await this.save(reward.markAsGiven());
  }

  async markAllAsPrinted(rewardIds: readonly string[]): Promise<void> {
    const rewards = this.grantsState().filter(
      (grant) => rewardIds.includes(grant.value.id) && grant.value.physicalStatus === 'queued',
    );
    if (rewards.length === 0) return;
    const updatedRewards = rewards.map((reward) => reward.updatePhysicalStatus('printed'));
    await this.rewards.saveAll(updatedRewards);
    const updatedById = new Map(updatedRewards.map((reward) => [reward.value.id, reward]));
    this.grantsState.update((grants) =>
      grants.map((grant) => updatedById.get(grant.value.id) ?? grant),
    );
  }

  private toQueueItem(grant: RewardGrant): RewardQueueItemViewModel {
    const value = grant.value;
    return {
      id: value.id,
      recipientId: value.recipientId,
      recipientName: value.recipientName,
      rewardType: value.type,
      rewardLabel: value.label,
      amount: value.amount,
      icon: this.rewardIcon(value.type),
      status: value.deliveryStatus === 'given' ? 'given' : value.physicalStatus === 'printed' ? 'printed' : 'unlocked',
      physicalStatus: value.physicalStatus,
      preparedRewardId: value.preparedRewardId,
    };
  }

  private rewardIcon(type: RewardType): PsIconName {
    switch (type) {
      case 'pokemon': return 'pokemon-sticker';
      case 'badge': return 'badge-medal';
      case 'outfit': return 'clothing-shirt';
      case 'achievement': return 'achievement-star';
      case 'quest-item': return 'quest-card';
      case 'card': return 'npc-card';
      case 'sticker': return 'reward-gift';
      case 'narrative': return 'timeline-scroll';
      default: return 'items-potion';
    }
  }

  private async save(updatedReward: RewardGrant): Promise<void> {
    await this.rewards.saveAll([updatedReward]);
    this.grantsState.update((grants) =>
      grants.map((grant) => (grant.value.id === updatedReward.value.id ? updatedReward : grant)),
    );
  }
}