import { computed, inject, Injectable, signal } from '@angular/core';

import { CreateAdventurePlanHandler } from '../../../application/adventure/commands/create-adventure-plan/create-adventure-plan.handler';
import { ADVENTURE_PLAN_REPOSITORY } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { ID_GENERATOR } from '../../../application/project/tokens/id-generator.token';
import { PROJECT_REPOSITORY } from '../../../application/project/tokens/project.tokens';
import { AudienceProfile } from '../../../domain/audience/models/audience-profile';
import { AudienceAgePresetId } from '../../../domain/audience/presets/audience-age-preset';
import { findAudienceAgePreset } from '../../../domain/audience/presets/audience-age-presets';
import { ProjectId } from '../../../domain/project/value-objects/project-id';
import { AdventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';

export interface CreateAdventureInput {
  readonly projectId: ProjectId;
  readonly title: string;
  readonly premise: string;
  readonly audiencePresetId: AudienceAgePresetId;
  readonly sessionLengthMinutes: number;
}

@Injectable()
export class CreateAdventureStore {
  private readonly handler = new CreateAdventurePlanHandler(
    inject(PROJECT_REPOSITORY),
    inject(ADVENTURE_PLAN_REPOSITORY),
    inject(ID_GENERATOR),
  );
  private readonly creatingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly createdAdventureIdState = signal<AdventurePlanId | null>(null);

  readonly creating = this.creatingState.asReadonly();
  readonly errorMessage = this.errorState.asReadonly();
  readonly canSubmit = computed(() => !this.creating());
  readonly createdAdventureId = this.createdAdventureIdState.asReadonly();

  async create(input: CreateAdventureInput): Promise<boolean> {
    if (this.creating()) return false;

    this.creatingState.set(true);
    this.errorState.set(null);

    try {
      const audienceProfile = this.createAudienceProfile(input);
      const result = await this.handler.execute({
        projectId: input.projectId,
        title: input.title,
        premise: input.premise,
        audienceProfile,
      });

      if (!result.isSuccess) {
        this.errorState.set(this.messageFor(result.error.code));
        return false;
      }

      this.createdAdventureIdState.set(result.value.id);
      return true;
    } catch {
      this.errorState.set('A kalandot most nem sikerült létrehozni.');
      return false;
    } finally {
      this.creatingState.set(false);
    }
  }

  clearError(): void {
    this.errorState.set(null);
  }

  private createAudienceProfile(input: CreateAdventureInput): AudienceProfile {
    const preset = findAudienceAgePreset(input.audiencePresetId);
    const result = AudienceProfile.create({
      ageRange: preset.ageRange,
      complexity: 'easy',
      dangerIntensity: 'low',
      scaryContent: 'mild',
      consequenceSeverity: 'gentle',
      conflictStyle: 'balanced',
      sessionLengthMinutes: input.sessionLengthMinutes,
    });

    if (!result.isSuccess) throw result.error;
    return result.value;
  }

  private messageFor(code: string): string {
    if (code === 'PROJECT_NOT_FOUND') return 'Ez a projekt már nem érhető el.';
    if (code === 'ADVENTURE_TITLE_ALREADY_EXISTS')
      return 'Már van ilyen című kaland ebben a projektben.';
    return 'Ellenőrizd a kaland címét és alapötletét.';
  }
}
