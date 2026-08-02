import { computed, inject, Injectable, signal } from '@angular/core';

import { CHARACTER_READER } from '../../../application/character/tokens/character.tokens';
import { REWARD_GRANT_REPOSITORY } from '../../../application/reward/tokens/reward-grant.tokens';
import type { Character } from '../../../domain/character/models/character';
import type { RewardGrant, RewardPhysicalStatus } from '../../../domain/reward/models/reward-grant';
import { projectId } from '../../../domain/project/value-objects/project-id';

type RewardDetailStatus = 'idle' | 'loading' | 'loaded' | 'saving' | 'not-found' | 'error';

@Injectable()
export class RewardDetailStore {
  private readonly repository = inject(REWARD_GRANT_REPOSITORY);
  private readonly characterReader = inject(CHARACTER_READER);
  private readonly statusState = signal<RewardDetailStatus>('idle');
  private readonly rewardState = signal<RewardGrant | null>(null);
  private readonly charactersState = signal<readonly Character[]>([]);

  readonly status = this.statusState.asReadonly();
  readonly reward = this.rewardState.asReadonly();
  readonly characters = this.charactersState.asReadonly();
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isSaving = computed(() => this.status() === 'saving');
  readonly isNotFound = computed(() => this.status() === 'not-found');
  readonly hasError = computed(() => this.status() === 'error');

  async load(rawProjectId: string, rewardId: string): Promise<void> {
    this.statusState.set('loading');
    try {
      const id = projectId(rawProjectId);
      const [reward, characters] = await Promise.all([
        this.repository.findById(id, rewardId),
        this.characterReader.findByProjectId(id),
      ]);
      if (!reward) {
        this.statusState.set('not-found');
        return;
      }
      this.rewardState.set(reward);
      this.charactersState.set(characters.filter((character) => character.status === 'active'));
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }

  async assignTo(characterId: string): Promise<void> {
    const reward = this.reward();
    const character = this.characters().find((item) => item.id === characterId);
    if (!reward || !character) return;
    await this.save(reward.assignTo(character.id, character.name));
  }

  async setPhysicalStatus(status: RewardPhysicalStatus): Promise<void> {
    const reward = this.reward();
    if (reward) await this.save(reward.updatePhysicalStatus(status));
  }

  async markAsGiven(): Promise<void> {
    const reward = this.reward();
    if (reward) await this.save(reward.markAsGiven());
  }

  private async save(reward: RewardGrant): Promise<void> {
    this.statusState.set('saving');
    try {
      await this.repository.saveAll([reward]);
      this.rewardState.set(reward);
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }
}
