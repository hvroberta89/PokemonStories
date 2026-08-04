import { computed, inject, Injectable, signal } from '@angular/core';

import { GenerateFoundationSuggestionsHandler } from '../../../application/assistant/queries/generate-foundation-suggestions/generate-foundation-suggestions.handler';
import { GenerateSceneSuggestionsHandler } from '../../../application/assistant/queries/generate-scene-suggestions/generate-scene-suggestions.handler';
import { GenerateStorySuggestionsHandler } from '../../../application/assistant/queries/generate-story-suggestions/generate-story-suggestions.handler';
import { ADVENTURE_ASSISTANT } from '../../../application/assistant/tokens/adventure-assistant.token';
import type {
  AdventureFoundationContext,
  AdventureFoundationSuggestion,
  AdventureSceneSuggestion,
  AdventureSceneSuggestionContext,
  AdventureStorySuggestion,
  AdventureStorySuggestionContext,
} from '../../../application/assistant/ports/adventure-assistant';
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
import { FeedbackToastStore } from '../../../shared/ui/feedback-toast/feedback-toast.store';

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
  private readonly foundationSuggestionsHandler = new GenerateFoundationSuggestionsHandler(
    inject(ADVENTURE_ASSISTANT),
  );
  private readonly sceneSuggestionsHandler = new GenerateSceneSuggestionsHandler(
    inject(ADVENTURE_ASSISTANT),
  );
  private readonly storySuggestionsHandler = new GenerateStorySuggestionsHandler(
    inject(ADVENTURE_ASSISTANT),
  );
  private readonly feedback = inject(FeedbackToastStore);
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
  private readonly foundationSuggestionsState = signal<readonly AdventureFoundationSuggestion[]>([]);
  private readonly generatingFoundationSuggestionsState = signal(false);
  private readonly sceneSuggestionsState = signal<readonly AdventureSceneSuggestion[]>([]);
  private readonly generatingSceneSuggestionsState = signal(false);
  private readonly storySuggestionsState = signal<readonly AdventureStorySuggestion[]>([]);
  private readonly generatingStorySuggestionsState = signal(false);

  readonly status = this.statusState.asReadonly();
  readonly adventure = this.adventureState.asReadonly();
  readonly errorMessage = this.errorState.asReadonly();
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isSaving = computed(() => this.status() === 'saving');
  readonly isNotFound = computed(() => this.status() === 'not-found');
  readonly preparedRewards = this.preparedRewardsState.asReadonly();
  readonly foundationSuggestions = this.foundationSuggestionsState.asReadonly();
  readonly isGeneratingFoundationSuggestions = this.generatingFoundationSuggestionsState.asReadonly();
  readonly sceneSuggestions = this.sceneSuggestionsState.asReadonly();
  readonly isGeneratingSceneSuggestions = this.generatingSceneSuggestionsState.asReadonly();
  readonly storySuggestions = this.storySuggestionsState.asReadonly();
  readonly isGeneratingStorySuggestions = this.generatingStorySuggestionsState.asReadonly();

  async generateFoundationSuggestions(context: AdventureFoundationContext): Promise<void> {
    this.generatingFoundationSuggestionsState.set(true);
    this.errorState.set(null);
    this.feedback.show({ kind: 'progress', title: 'Ötletek készülnek', message: 'A Kalandsegítő három lehetséges irányt keres.', icon: 'play-pokeball' }, 0);
    try {
      this.foundationSuggestionsState.set(await this.foundationSuggestionsHandler.execute(context));
      this.feedback.show({ kind: 'success', title: 'Megérkeztek az ötletek', message: 'Válassz egy kalandalapot, vagy finomítsd tovább.', icon: 'success-check' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Az AI javaslatokat most nem sikerült elkészíteni.';
      this.errorState.set(message);
      this.feedback.show({ kind: 'error', title: 'Az ötletek nem készültek el', message, icon: 'error-cross' }, 7_000);
    } finally {
      this.generatingFoundationSuggestionsState.set(false);
    }
  }

  async generateSceneSuggestions(context: AdventureSceneSuggestionContext): Promise<void> {
    this.generatingSceneSuggestionsState.set(true);
    this.errorState.set(null);
    this.feedback.show({ kind: 'progress', title: 'Jelenetötletek készülnek', message: 'A Kalandsegítő három jelenetet állít össze.', icon: 'play-pokeball' }, 0);
    try {
      this.sceneSuggestionsState.set(await this.sceneSuggestionsHandler.execute(context));
      this.feedback.show({ kind: 'success', title: 'Megérkeztek a jelenetötletek', message: 'Válassz egyet kiindulópontnak.', icon: 'success-check' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Az AI javaslatokat most nem sikerült elkészíteni.';
      this.errorState.set(message);
      this.feedback.show({ kind: 'error', title: 'A jelenetötletek nem készültek el', message, icon: 'error-cross' }, 7_000);
    } finally {
      this.generatingSceneSuggestionsState.set(false);
    }
  }

  clearSceneSuggestions(): void {
    this.sceneSuggestionsState.set([]);
  }

  async generateStorySuggestions(context: AdventureStorySuggestionContext): Promise<void> {
    this.generatingStorySuggestionsState.set(true);
    this.errorState.set(null);
    this.feedback.show({ kind: 'progress', title: 'Történetívek készülnek', message: 'A Kalandsegítő három narratív irányt dolgoz ki.', icon: 'play-pokeball' }, 0);
    try {
      this.storySuggestionsState.set(await this.storySuggestionsHandler.execute(context));
      this.feedback.show({ kind: 'success', title: 'Megérkeztek a történetívek', message: 'Válassz egy irányt a történethez.', icon: 'success-check' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Az AI javaslatokat most nem sikerült elkészíteni.';
      this.errorState.set(message);
      this.feedback.show({ kind: 'error', title: 'A történetívek nem készültek el', message, icon: 'error-cross' }, 7_000);
    } finally {
      this.generatingStorySuggestionsState.set(false);
    }
  }

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
