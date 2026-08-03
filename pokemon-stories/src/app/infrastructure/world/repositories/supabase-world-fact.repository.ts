import { inject, Injectable } from '@angular/core';

import type { WorldFactRepository } from '../../../application/world/ports/world-fact-repository';
import type { ProjectId } from '../../../domain/project/value-objects/project-id';
import { projectId } from '../../../domain/project/value-objects/project-id';
import {
  WorldFact,
  type WorldFactCategory,
  type WorldFactStatus,
} from '../../../domain/world/models/world-fact';
import { SUPABASE_CLIENT } from '../../supabase/supabase-client.token';

interface WorldFactRow {
  readonly id: string;
  readonly project_id: string;
  readonly text: string;
  readonly category: WorldFactCategory;
  readonly status: WorldFactStatus;
}

@Injectable()
export class SupabaseWorldFactRepository implements WorldFactRepository {
  private readonly supabase = inject(SUPABASE_CLIENT);

  async save(fact: WorldFact): Promise<void> {
    const value = fact.value;
    const { error } = await this.supabase.from('world_facts').upsert({
      id: value.id,
      project_id: value.projectId,
      text: value.text,
      category: value.category,
      status: value.status,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(`Could not save world fact: ${error.message}`);
  }

  async findByProject(project: ProjectId): Promise<readonly WorldFact[]> {
    const { data, error } = await this.supabase
      .from('world_facts')
      .select('id, project_id, text, category, status')
      .eq('project_id', project)
      .order('updated_at', { ascending: false })
      .returns<WorldFactRow[]>();
    if (error) throw new Error(`Could not load world facts: ${error.message}`);
    return (data ?? []).map((row) =>
      WorldFact.create({
        id: row.id,
        projectId: projectId(row.project_id),
        text: row.text,
        category: row.category,
        status: row.status,
      }),
    );
  }
}
