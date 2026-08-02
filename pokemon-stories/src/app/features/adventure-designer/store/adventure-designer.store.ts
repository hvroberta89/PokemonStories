import { computed, inject, Injectable, signal } from '@angular/core';

import { UpdateAdventureFoundationHandler } from '../../../application/adventure/commands/update-adventure-foundation/update-adventure-foundation.handler';
import { AddAdventureSceneHandler } from '../../../application/adventure/commands/add-adventure-scene/add-adventure-scene.handler';
import { ManageAdventureSceneHandler } from '../../../application/adventure/commands/manage-adventure-scene/manage-adventure-scene.handler';
import { ManageAdventureSceneCommand } from '../../../application/adventure/commands/manage-adventure-scene/manage-adventure-scene.command';
import { UpdateAdventureStoryHandler } from '../../../application/adventure/commands/update-adventure-story/update-adventure-story.handler';
import { UpdateAdventureStoryCommand } from '../../../application/adventure/commands/update-adventure-story/update-adventure-story.command';
import { MarkAdventureReadyHandler } from '../../../application/adventure/commands/mark-adventure-ready/mark-adventure-ready.handler';
import { GetAdventurePlanHandler } from '../../../application/adventure/queries/get-adventure-plan/get-adventure-plan.handler';
import {
  ADVENTURE_PLAN_READER,
  ADVENTURE_PLAN_REPOSITORY,
} from '../../../application/adventure/tokens/adventure-plan.tokens';
import { AudienceProfile } from '../../../domain/audience/models/audience-profile';
import { AudienceAgePresetId } from '../../../domain/audience/presets/audience-age-preset';
import { audienceAgePresets } from '../../../domain/audience/presets/audience-age-presets';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { AdventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { ProjectId } from '../../../domain/project/value-objects/project-id';
import { ID_GENERATOR } from '../../../application/project/tokens/id-generator.token';
import { PREPARED_REWARD_REPOSITORY } from '../../../application/reward/tokens/prepared-reward.tokens';
import { PreparedReward } from '../../../domain/reward/models/prepared-reward';
import type { RewardType } from '../../../domain/reward/models/reward-grant';
import type { AdventureSceneId } from '../../../domain/adventure/value-objects/adventure-scene-id';

export type DesignerStatus =
  'idle' | 'loading' | 'ready' | 'saving' | 'saved' | 'not-found' | 'error';

export interface FoundationDraft {
  readonly title: string;
  readonly premise: string;
  readonly audiencePresetId: AudienceAgePresetId;
  readonly sessionLengthMinutes: number;
}

@Injectable()
export class AdventureDesignerStore {
  private readonly getHandler = new GetAdventurePlanHandler(inject(ADVENTURE_PLAN_READER));
  private readonly updateHandler = new UpdateAdventureFoundationHandler(
    inject(ADVENTURE_PLAN_REPOSITORY),
  );
  private readonly addSceneHandler = new AddAdventureSceneHandler(
    inject(ADVENTURE_PLAN_REPOSITORY),
    inject(ID_GENERATOR),
  );
  private readonly manageSceneHandler = new ManageAdventureSceneHandler(
    inject(ADVENTURE_PLAN_REPOSITORY),
  );
  private readonly updateStoryHandler = new UpdateAdventureStoryHandler(
    inject(ADVENTURE_PLAN_REPOSITORY),
  );
  private readonly markReadyHandler = new MarkAdventureReadyHandler(
    inject(ADVENTURE_PLAN_REPOSITORY),
  );
  private readonly statusState = signal<DesignerStatus>('idle');
  private readonly adventureState = signal<AdventurePlan | null>(null);
  private readonly errorState = signal<string | null>(null);
  private readonly preparedRewardRepository = inject(PREPARED_REWARD_REPOSITORY);
  private readonly ids = inject(ID_GENERATOR);
  private readonly preparedRewardsState = signal<readonly PreparedReward[]>([]);

  readonly status = this.statusState.asReadonly();
  readonly adventure = this.adventureState.asReadonly();
  readonly errorMessage = this.errorState.asReadonly();
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isSaving = computed(() => this.status() === 'saving');
  readonly isNotFound = computed(() => this.status() === 'not-found');
  readonly preparedRewards = this.preparedRewardsState.asReadonly();

  async load(projectId: ProjectId, adventureId: AdventurePlanId): Promise<void> {
    this.statusState.set('loading');
    try {
      const adventure = await this.getHandler.execute({ projectId, adventurePlanId: adventureId });
      if (!adventure) {
        this.statusState.set('not-found');
        return;
      }
      this.adventureState.set(adventure);
      this.preparedRewardsState.set(
        await this.preparedRewardRepository.findByAdventure(projectId, adventureId),
      );
      this.statusState.set('ready');
    } catch {
      this.statusState.set('error');
      this.errorState.set('A kalandot most nem sikerült betölteni.');
    }
  }

  async addPreparedReward(input: {
    readonly projectId: ProjectId;
    readonly adventureId: AdventurePlanId;
    readonly sceneId?: AdventureSceneId;
    readonly type: RewardType;
    readonly label: string;
    readonly amount: number;
    readonly physicalStatus: 'queued' | 'skipped';
  }): Promise<boolean> {
    this.statusState.set('saving');
    try {
      const reward = PreparedReward.create({ ...input, id: this.ids.generate() });
      await this.preparedRewardRepository.save(reward);
      this.preparedRewardsState.update((items) => [...items, reward]);
      this.statusState.set('saved');
      return true;
    } catch {
      this.errorState.set('Az előkészített jutalmat most nem sikerült elmenteni.');
      this.statusState.set('ready');
      return false;
    }
  }

  async removePreparedReward(projectId: ProjectId, rewardId: string): Promise<void> {
    try {
      await this.preparedRewardRepository.remove(projectId, rewardId);
      this.preparedRewardsState.update((items) => items.filter((item) => item.value.id !== rewardId));
    } catch {
      this.errorState.set('Az előkészített jutalmat most nem sikerült törölni.');
    }
  }

  async saveFoundation(
    projectId: ProjectId,
    adventureId: AdventurePlanId,
    draft: FoundationDraft,
  ): Promise<boolean> {
    this.statusState.set('saving');
    this.errorState.set(null);
    try {
      const audienceProfile = this.createAudienceProfile(draft);
      const result = await this.updateHandler.execute({
        projectId,
        adventurePlanId: adventureId,
        title: draft.title,
        premise: draft.premise,
        audienceProfile,
      });
      if (!result.isSuccess) {
        this.statusState.set('ready');
        this.errorState.set(this.messageFor(result.error.code));
        return false;
      }
      this.adventureState.set(result.value);
      this.statusState.set('saved');
      return true;
    } catch {
      this.statusState.set('ready');
      this.errorState.set('A módosításokat most nem sikerült elmenteni.');
      return false;
    }
  }

  async addScene(
    projectId: ProjectId,
    adventureId: AdventurePlanId,
    input: { readonly title: string; readonly description: string; readonly goal: string },
  ): Promise<boolean> {
    this.statusState.set('saving');
    this.errorState.set(null);
    try {
      const result = await this.addSceneHandler.execute({
        projectId,
        adventurePlanId: adventureId,
        ...input,
      });
      if (!result.isSuccess) {
        this.statusState.set('ready');
        this.errorState.set(this.messageFor(result.error.code));
        return false;
      }
      this.adventureState.set(result.value);
      this.statusState.set('saved');
      return true;
    } catch {
      this.statusState.set('ready');
      this.errorState.set('A jelenetet most nem sikerült elmenteni.');
      return false;
    }
  }

  async manageScene(command: ManageAdventureSceneCommand): Promise<boolean> {
    this.statusState.set('saving');
    this.errorState.set(null);
    try {
      const result = await this.manageSceneHandler.execute(command);
      if (!result.isSuccess) {
        this.statusState.set('ready');
        this.errorState.set('A jelenet módosítása nem sikerült.');
        return false;
      }
      this.adventureState.set(result.value);
      this.statusState.set('saved');
      return true;
    } catch {
      this.statusState.set('ready');
      this.errorState.set('A jelenet módosítása nem sikerült.');
      return false;
    }
  }

  async saveStory(command: UpdateAdventureStoryCommand): Promise<boolean> {
    this.statusState.set('saving');
    this.errorState.set(null);
    try {
      const result = await this.updateStoryHandler.execute(command);
      if (!result.isSuccess) {
        this.statusState.set('ready');
        this.errorState.set('A történet módosítása nem sikerült.');
        return false;
      }
      this.adventureState.set(result.value);
      this.statusState.set('saved');
      return true;
    } catch {
      this.statusState.set('ready');
      this.errorState.set('A történet módosítása nem sikerült.');
      return false;
    }
  }

  async markReady(projectId: ProjectId, adventurePlanId: AdventurePlanId): Promise<boolean> {
    this.statusState.set('saving');
    this.errorState.set(null);
    try {
      const result = await this.markReadyHandler.execute({ projectId, adventurePlanId });
      if (!result.isSuccess) {
        this.statusState.set('ready');
        this.errorState.set('A kaland még nem jelölhető játékra késznek.');
        return false;
      }
      this.adventureState.set(result.value);
      this.statusState.set('saved');
      return true;
    } catch {
      this.statusState.set('ready');
      this.errorState.set('A kaland állapotát most nem sikerült frissíteni.');
      return false;
    }
  }

  private createAudienceProfile(draft: FoundationDraft): AudienceProfile {
    const preset = audienceAgePresets.find((item) => item.id === draft.audiencePresetId);
    if (!preset) throw new Error('Unsupported audience preset.');
    const result = AudienceProfile.create({
      ageRange: preset.ageRange,
      complexity: 'easy',
      dangerIntensity: 'low',
      scaryContent: 'mild',
      consequenceSeverity: 'gentle',
      conflictStyle: 'balanced',
      sessionLengthMinutes: draft.sessionLengthMinutes,
    });
    if (!result.isSuccess) throw result.error;
    return result.value;
  }

  private messageFor(code: string): string {
    if (code === 'ADVENTURE_TITLE_ALREADY_EXISTS')
      return 'Már van ilyen című kaland ebben a projektben.';
    if (code === 'ADVENTURE_PLAN_NOT_FOUND') return 'Ez a kaland már nem érhető el.';
    return 'Ellenőrizd a Foundation kötelező mezőit.';
  }
}
