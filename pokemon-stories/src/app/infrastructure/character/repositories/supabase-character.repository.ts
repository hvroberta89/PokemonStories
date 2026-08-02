import { inject, Injectable } from '@angular/core';

import { CharacterRepository } from '../../../application/character/ports/character-repository';
import { Character, CharacterStatus } from '../../../domain/character/models/character';
import { CharacterId, characterId } from '../../../domain/character/value-objects/character-id';
import { ProjectId, projectId } from '../../../domain/project/value-objects/project-id';
import { SUPABASE_CLIENT } from '../../supabase/supabase-client.token';

interface CharacterRow {
  readonly id: string;
  readonly project_id: string;
  readonly name: string;
  readonly description: string | null;
  readonly personality_notes: string | null;
  readonly goals: string | null;
  readonly story_notes: string | null;
  readonly status: CharacterStatus;
}

@Injectable()
export class SupabaseCharacterRepository implements CharacterRepository {
  private static readonly columns =
    'id, project_id, name, description, personality_notes, goals, story_notes, status';

  private readonly supabase = inject(SUPABASE_CLIENT);

  async save(character: Character): Promise<void> {
    const { error } = await this.supabase.from('characters').upsert({
      id: character.id,
      project_id: character.projectId,
      name: character.name,
      description: character.description ?? null,
      personality_notes: character.personalityNotes ?? null,
      goals: character.goals ?? null,
      story_notes: character.storyNotes ?? null,
      status: character.status,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(`Could not save character: ${error.message}`);
    }
  }

  async findById(id: CharacterId): Promise<Character | undefined> {
    const { data, error } = await this.supabase
      .from('characters')
      .select(SupabaseCharacterRepository.columns)
      .eq('id', id)
      .maybeSingle<CharacterRow>();

    if (error) {
      throw new Error(`Could not load character: ${error.message}`);
    }
    return data ? this.restoreCharacter(data) : undefined;
  }

  async findByProjectId(project: ProjectId): Promise<readonly Character[]> {
    const { data, error } = await this.supabase
      .from('characters')
      .select(SupabaseCharacterRepository.columns)
      .eq('project_id', project)
      .order('created_at', { ascending: true })
      .returns<CharacterRow[]>();

    if (error) {
      throw new Error(`Could not load characters: ${error.message}`);
    }
    return (data ?? []).map((row) => this.restoreCharacter(row));
  }

  async existsByName(project: ProjectId, name: string): Promise<boolean> {
    const escapedName = name
      .trim()
      .replaceAll('\\', '\\\\')
      .replaceAll('%', '\\%')
      .replaceAll('_', '\\_');
    const { data, error } = await this.supabase
      .from('characters')
      .select('id')
      .eq('project_id', project)
      .ilike('name', escapedName)
      .limit(1);

    if (error) {
      throw new Error(`Could not check character name: ${error.message}`);
    }
    return (data?.length ?? 0) > 0;
  }

  private restoreCharacter(row: CharacterRow): Character {
    const result = Character.restore({
      id: characterId(row.id),
      projectId: projectId(row.project_id),
      name: row.name,
      description: row.description ?? undefined,
      personalityNotes: row.personality_notes ?? undefined,
      goals: row.goals ?? undefined,
      storyNotes: row.story_notes ?? undefined,
      status: row.status,
    });

    if (!result.isSuccess) {
      throw new Error(`Stored character ${row.id} violates the domain model.`);
    }
    return result.value;
  }
}
