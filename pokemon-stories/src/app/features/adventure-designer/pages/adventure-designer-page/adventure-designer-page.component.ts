import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AudienceAgePresetId } from '../../../../domain/audience/presets/audience-age-preset';
import { audienceAgePresets } from '../../../../domain/audience/presets/audience-age-presets';
import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { AdventureSceneId } from '../../../../domain/adventure/value-objects/adventure-scene-id';
import { AdventureScene } from '../../../../domain/adventure/models/adventure-scene';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { PsVoiceInputDirective } from '../../../../shared/ui/voice-input/ps-voice-input.directive';
import { AdventureDesignerStore } from '../../store/adventure-designer.store';
import type { RewardType } from '../../../../domain/reward/models/reward-grant';

@Component({
  selector: 'app-adventure-designer-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent, PsVoiceInputDirective],
  templateUrl: './adventure-designer-page.component.html',
  styleUrl: './adventure-designer-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdventureDesignerStore],
})
export class AdventureDesignerPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(AdventureDesignerStore);
  protected readonly projectId = projectId(this.route.snapshot.paramMap.get('projectId') ?? '');
  protected readonly adventureId = adventurePlanId(
    this.route.snapshot.paramMap.get('adventureId') ?? '',
  );
  protected readonly audiencePresets = audienceAgePresets;
  protected readonly title = signal('');
  protected readonly premise = signal('');
  protected readonly audiencePresetId = signal<AudienceAgePresetId>('children');
  protected readonly sessionLengthMinutes = signal(60);
  protected readonly submitted = signal(false);
  protected readonly foundationIdea = signal('');
  protected readonly sceneFormOpen = signal(false);
  protected readonly sceneTitle = signal('');
  protected readonly sceneDescription = signal('');
  protected readonly sceneGoal = signal('');
  protected readonly sceneDirection = signal('');
  protected readonly sceneSubmitted = signal(false);
  protected readonly editingSceneId = signal<AdventureSceneId | null>(null);
  protected readonly deletingSceneId = signal<AdventureSceneId | null>(null);
  protected readonly storyOpening = signal('');
  protected readonly storyDevelopment = signal('');
  protected readonly storyClimax = signal('');
  protected readonly storyResolution = signal('');
  protected readonly storyDirection = signal('');
  protected readonly rewardType = signal<RewardType>('item');
  protected readonly rewardLabel = signal('');
  protected readonly rewardAmount = signal(1);
  protected readonly rewardSceneId = signal('');
  protected readonly rewardPhysicalStatus = signal<'queued' | 'skipped'>('queued');
  protected readonly rewardSubmitted = signal(false);

  constructor() {
    void this.load();
  }

  protected updateText(field: 'title' | 'premise', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    field === 'title' ? this.title.set(value) : this.premise.set(value);
  }

  protected updateAudience(event: Event): void {
    this.audiencePresetId.set((event.target as HTMLSelectElement).value as AudienceAgePresetId);
  }

  protected updateLength(event: Event): void {
    this.sessionLengthMinutes.set(Number((event.target as HTMLSelectElement).value));
  }

  protected generateFoundationSuggestions(): void {
    const audience = this.audiencePresets.find((item) => item.id === this.audiencePresetId());
    if (!audience || !this.foundationIdea().trim()) return;
    void this.store.generateFoundationSuggestions({
      idea: this.foundationIdea(),
      audienceLabel: audience.label,
      sessionLengthMinutes: this.sessionLengthMinutes(),
    });
  }

  protected chooseFoundationSuggestion(suggestion: { readonly title: string; readonly premise: string }): void {
    this.title.set(suggestion.title);
    this.premise.set(suggestion.premise);
    this.submitted.set(false);
  }

  protected async save(): Promise<void> {
    this.submitted.set(true);
    if (!this.title().trim() || !this.premise().trim()) return;
    await this.store.saveFoundation(this.projectId, this.adventureId, {
      title: this.title(),
      premise: this.premise(),
      audiencePresetId: this.audiencePresetId(),
      sessionLengthMinutes: this.sessionLengthMinutes(),
    });
  }

  protected updateScene(field: 'title' | 'description' | 'goal', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    ({
      title: this.sceneTitle,
      description: this.sceneDescription,
      goal: this.sceneGoal,
    })[field].set(value);
  }

  protected async addScene(): Promise<void> {
    this.sceneSubmitted.set(true);
    if (!this.sceneTitle().trim() || !this.sceneDescription().trim() || !this.sceneGoal().trim()) {
      return;
    }
    const input = {
      title: this.sceneTitle(),
      description: this.sceneDescription(),
      goal: this.sceneGoal(),
    };
    const editingId = this.editingSceneId();
    const success = editingId
      ? await this.store.manageScene({
          action: 'update',
          projectId: this.projectId,
          adventurePlanId: this.adventureId,
          sceneId: editingId,
          ...input,
        })
      : await this.store.addScene(this.projectId, this.adventureId, input);
    if (success) {
      this.sceneFormOpen.set(false);
      this.sceneSubmitted.set(false);
      this.sceneTitle.set('');
      this.sceneDescription.set('');
      this.sceneGoal.set('');
      this.editingSceneId.set(null);
      this.store.clearSceneSuggestions();
    }
  }

  protected openNewScene(): void {
    this.editingSceneId.set(null);
    this.sceneTitle.set('');
    this.sceneDescription.set('');
    this.sceneGoal.set('');
    this.sceneDirection.set('');
    this.store.clearSceneSuggestions();
    this.sceneSubmitted.set(false);
    this.sceneFormOpen.set(true);
  }

  protected editScene(scene: AdventureScene): void {
    this.editingSceneId.set(scene.id);
    this.sceneTitle.set(scene.title);
    this.sceneDescription.set(scene.description);
    this.sceneGoal.set(scene.goal);
    this.sceneDirection.set('');
    this.store.clearSceneSuggestions();
    this.sceneSubmitted.set(false);
    this.sceneFormOpen.set(true);
  }

  protected generateSceneSuggestions(): void {
    const adventure = this.store.adventure();
    const audience = this.audiencePresets.find((item) => item.id === this.audiencePresetId());
    if (!adventure || !audience) return;
    void this.store.generateSceneSuggestions({
      adventureTitle: adventure.title,
      premise: adventure.premise,
      audienceLabel: audience.label,
      sessionLengthMinutes: this.sessionLengthMinutes(),
      direction: this.sceneDirection(),
    });
  }

  protected chooseSceneSuggestion(suggestion: {
    readonly title: string;
    readonly description: string;
    readonly goal: string;
  }): void {
    this.sceneTitle.set(suggestion.title);
    this.sceneDescription.set(suggestion.description);
    this.sceneGoal.set(suggestion.goal);
    this.sceneSubmitted.set(false);
  }

  protected moveScene(sceneId: AdventureSceneId, direction: 'up' | 'down'): void {
    void this.store.manageScene({
      action: 'move',
      projectId: this.projectId,
      adventurePlanId: this.adventureId,
      sceneId,
      direction,
    });
  }

  protected selectOpeningScene(sceneId: AdventureSceneId): void {
    void this.store.manageScene({
      action: 'select-opening',
      projectId: this.projectId,
      adventurePlanId: this.adventureId,
      sceneId,
    });
  }

  protected async confirmDeleteScene(): Promise<void> {
    const sceneId = this.deletingSceneId();
    if (!sceneId) return;
    const success = await this.store.manageScene({
      action: 'remove',
      projectId: this.projectId,
      adventurePlanId: this.adventureId,
      sceneId,
    });
    if (success) this.deletingSceneId.set(null);
  }

  protected updateStory(
    field: 'opening' | 'development' | 'climax' | 'resolution',
    event: Event,
  ): void {
    const value = (event.target as HTMLTextAreaElement).value;
    ({
      opening: this.storyOpening,
      development: this.storyDevelopment,
      climax: this.storyClimax,
      resolution: this.storyResolution,
    })[field].set(value);
  }

  protected saveStory(): void {
    void this.store.saveStory({
      projectId: this.projectId,
      adventurePlanId: this.adventureId,
      opening: this.storyOpening(),
      development: this.storyDevelopment(),
      climax: this.storyClimax(),
      resolution: this.storyResolution(),
    });
  }

  protected generateStorySuggestions(): void {
    const adventure = this.store.adventure();
    const audience = this.audiencePresets.find((item) => item.id === this.audiencePresetId());
    if (!adventure || !audience) return;
    void this.store.generateStorySuggestions({
      adventureTitle: adventure.title,
      premise: adventure.premise,
      audienceLabel: audience.label,
      sessionLengthMinutes: this.sessionLengthMinutes(),
      direction: this.storyDirection(),
    });
  }

  protected chooseStorySuggestion(suggestion: {
    readonly opening: string;
    readonly development: string;
    readonly climax: string;
    readonly resolution: string;
  }): void {
    this.storyOpening.set(suggestion.opening);
    this.storyDevelopment.set(suggestion.development);
    this.storyClimax.set(suggestion.climax);
    this.storyResolution.set(suggestion.resolution);
  }

  protected markAdventureReady(): void {
    void this.store.markReady(this.projectId, this.adventureId);
  }

  protected async addPreparedReward(): Promise<void> {
    this.rewardSubmitted.set(true);
    if (!this.rewardLabel().trim()) return;
    const success = await this.store.addPreparedReward({
      projectId: this.projectId,
      adventureId: this.adventureId,
      sceneId: this.rewardSceneId() ? (this.rewardSceneId() as AdventureSceneId) : undefined,
      type: this.rewardType(),
      label: this.rewardLabel(),
      amount: this.rewardAmount(),
      physicalStatus: this.rewardPhysicalStatus(),
    });
    if (success) {
      this.rewardLabel.set('');
      this.rewardAmount.set(1);
      this.rewardSubmitted.set(false);
    }
  }

  private async load(): Promise<void> {
    await this.store.load(this.projectId, this.adventureId);
    const adventure = this.store.adventure();
    if (!adventure) return;
    this.title.set(adventure.title);
    this.premise.set(adventure.premise);
    this.sessionLengthMinutes.set(adventure.audienceProfile.sessionLengthMinutes);
    const preset = audienceAgePresets.find((item) =>
      item.ageRange.equals(adventure.audienceProfile.ageRange),
    );
    if (preset) this.audiencePresetId.set(preset.id);
    this.storyOpening.set(adventure.story.opening ?? '');
    this.storyDevelopment.set(adventure.story.development ?? '');
    this.storyClimax.set(adventure.story.climax ?? '');
    this.storyResolution.set(adventure.story.resolution ?? '');
  }
}
