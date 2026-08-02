import { inject, Injectable } from '@angular/core';

import { AdventurePlanReader } from '../../../application/adventure/ports/adventure-plan-reader';
import { AdventurePlanRepository } from '../../../application/adventure/ports/adventure-plan-repository';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { AdventurePlanStatus } from '../../../domain/adventure/models/adventure-plan-status';
import { AdventureScene } from '../../../domain/adventure/models/adventure-scene';
import { AdventureStory } from '../../../domain/adventure/models/adventure-story';
import {
  AdventurePlanId,
  adventurePlanId,
} from '../../../domain/adventure/value-objects/adventure-plan-id';
import { adventureSceneId } from '../../../domain/adventure/value-objects/adventure-scene-id';
import { AudienceProfile } from '../../../domain/audience/models/audience-profile';
import {
  ComplexityLevel,
  ConflictStyle,
  ConsequenceSeverity,
  DangerIntensity,
  ScaryContentLevel,
} from '../../../domain/audience/models/audience-profile.types';
import { AgeRange } from '../../../domain/audience/value-objects/age-range';
import { characterId } from '../../../domain/character/value-objects/character-id';
import { ProjectId, projectId } from '../../../domain/project/value-objects/project-id';
import { SUPABASE_CLIENT } from '../../supabase/supabase-client.token';

interface AudienceProfileRow {
  readonly minimumAge: number;
  readonly maximumAge: number;
  readonly complexity: ComplexityLevel;
  readonly dangerIntensity: DangerIntensity;
  readonly scaryContent: ScaryContentLevel;
  readonly consequenceSeverity: ConsequenceSeverity;
  readonly conflictStyle: ConflictStyle;
  readonly sessionLengthMinutes: number;
}

interface AdventureRow {
  readonly id: string;
  readonly project_id: string;
  readonly title: string;
  readonly premise: string;
  readonly status: AdventurePlanStatus;
  readonly audience_profile: AudienceProfileRow;
  readonly story: AdventureStory;
  readonly scenes: readonly {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly goal: string;
    readonly order: number;
    readonly isOpening: boolean;
  }[];
  readonly expected_character_ids: readonly string[];
}

@Injectable()
export class SupabaseAdventurePlanRepository
  implements AdventurePlanRepository, AdventurePlanReader
{
  private static readonly columns =
    'id, project_id, title, premise, status, audience_profile, story, scenes, expected_character_ids';
  private readonly supabase = inject(SUPABASE_CLIENT);

  async save(adventure: AdventurePlan): Promise<void> {
    const { error } = await this.supabase.from('adventures').upsert({
      id: adventure.id,
      project_id: adventure.projectId,
      title: adventure.title,
      premise: adventure.premise,
      status: adventure.status,
      audience_profile: this.serializeAudience(adventure.audienceProfile),
      story: adventure.story,
      scenes: adventure.scenes,
      expected_character_ids: adventure.expectedCharacterIds,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(`Could not save adventure: ${error.message}`);
  }

  async findById(id: AdventurePlanId): Promise<AdventurePlan | undefined> {
    const { data, error } = await this.supabase
      .from('adventures')
      .select(SupabaseAdventurePlanRepository.columns)
      .eq('id', id)
      .maybeSingle<AdventureRow>();
    if (error) throw new Error(`Could not load adventure: ${error.message}`);
    return data ? this.restoreAdventure(data) : undefined;
  }

  async findByProjectId(project: ProjectId): Promise<readonly AdventurePlan[]> {
    const { data, error } = await this.supabase
      .from('adventures')
      .select(SupabaseAdventurePlanRepository.columns)
      .eq('project_id', project)
      .order('created_at', { ascending: false })
      .returns<AdventureRow[]>();
    if (error) throw new Error(`Could not load adventures: ${error.message}`);
    return (data ?? []).map((row) => this.restoreAdventure(row));
  }

  async existsByTitle(project: ProjectId, title: string): Promise<boolean> {
    const escapedTitle = title
      .trim()
      .replaceAll('\\', '\\\\')
      .replaceAll('%', '\\%')
      .replaceAll('_', '\\_');
    const { data, error } = await this.supabase
      .from('adventures')
      .select('id')
      .eq('project_id', project)
      .ilike('title', escapedTitle)
      .limit(1);
    if (error) throw new Error(`Could not check adventure title: ${error.message}`);
    return (data?.length ?? 0) > 0;
  }

  private restoreAdventure(row: AdventureRow): AdventurePlan {
    const ageRange = AgeRange.create(
      row.audience_profile.minimumAge,
      row.audience_profile.maximumAge,
    );
    if (!ageRange.isSuccess)
      throw new Error(`Stored adventure ${row.id} has an invalid age range.`);
    const audience = AudienceProfile.create({
      ageRange: ageRange.value,
      complexity: row.audience_profile.complexity,
      dangerIntensity: row.audience_profile.dangerIntensity,
      scaryContent: row.audience_profile.scaryContent,
      consequenceSeverity: row.audience_profile.consequenceSeverity,
      conflictStyle: row.audience_profile.conflictStyle,
      sessionLengthMinutes: row.audience_profile.sessionLengthMinutes,
    });
    if (!audience.isSuccess) throw new Error(`Stored adventure ${row.id} has an invalid audience.`);

    const scenes: AdventureScene[] = row.scenes.map((scene) => ({
      ...scene,
      id: adventureSceneId(scene.id),
    }));
    const result = AdventurePlan.restore({
      id: adventurePlanId(row.id),
      projectId: projectId(row.project_id),
      title: row.title,
      premise: row.premise,
      audienceProfile: audience.value,
      status: row.status,
      story: row.story,
      scenes,
      expectedCharacterIds: row.expected_character_ids.map(characterId),
    });
    if (!result.isSuccess) {
      throw new Error(`Stored adventure ${row.id} violates the domain model.`);
    }
    return result.value;
  }

  private serializeAudience(profile: AudienceProfile): AudienceProfileRow {
    return {
      minimumAge: profile.ageRange.minimum,
      maximumAge: profile.ageRange.maximum,
      complexity: profile.complexity,
      dangerIntensity: profile.dangerIntensity,
      scaryContent: profile.scaryContent,
      consequenceSeverity: profile.consequenceSeverity,
      conflictStyle: profile.conflictStyle,
      sessionLengthMinutes: profile.sessionLengthMinutes,
    };
  }
}
