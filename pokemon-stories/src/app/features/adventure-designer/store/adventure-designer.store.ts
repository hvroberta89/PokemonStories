import { computed, inject, Injectable, signal } from '@angular/core';

import { UpdateAdventureFoundationHandler } from '../../../application/adventure/commands/update-adventure-foundation/update-adventure-foundation.handler';
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
  private readonly statusState = signal<DesignerStatus>('idle');
  private readonly adventureState = signal<AdventurePlan | null>(null);
  private readonly errorState = signal<string | null>(null);

  readonly status = this.statusState.asReadonly();
  readonly adventure = this.adventureState.asReadonly();
  readonly errorMessage = this.errorState.asReadonly();
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isSaving = computed(() => this.status() === 'saving');
  readonly isNotFound = computed(() => this.status() === 'not-found');

  async load(projectId: ProjectId, adventureId: AdventurePlanId): Promise<void> {
    this.statusState.set('loading');
    try {
      const adventure = await this.getHandler.execute({ projectId, adventurePlanId: adventureId });
      if (!adventure) {
        this.statusState.set('not-found');
        return;
      }
      this.adventureState.set(adventure);
      this.statusState.set('ready');
    } catch {
      this.statusState.set('error');
      this.errorState.set('A kalandot most nem sikerült betölteni.');
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
