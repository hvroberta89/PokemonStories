import { inject, Injectable } from '@angular/core';

import type { NpcRepository } from '../../../application/npc/ports/npc-repository';
import { Npc, type NpcStatus } from '../../../domain/npc/models/npc';
import { npcId } from '../../../domain/npc/value-objects/npc-id';
import type { ProjectId } from '../../../domain/project/value-objects/project-id';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { SUPABASE_CLIENT } from '../../supabase/supabase-client.token';

interface NpcRow {
  readonly id: string;
  readonly project_id: string;
  readonly name: string;
  readonly role: string;
  readonly description: string | null;
  readonly status: NpcStatus;
}

@Injectable()
export class SupabaseNpcRepository implements NpcRepository {
  private readonly supabase = inject(SUPABASE_CLIENT);

  async save(npc: Npc): Promise<void> {
    const value = npc.value;
    const { error } = await this.supabase.from('npcs').upsert({
      id: value.id,
      project_id: value.projectId,
      name: value.name,
      role: value.role,
      description: value.description ?? null,
      status: value.status,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(`Could not save NPC: ${error.message}`);
  }

  async findByProject(project: ProjectId): Promise<readonly Npc[]> {
    const { data, error } = await this.supabase
      .from('npcs')
      .select('id, project_id, name, role, description, status')
      .eq('project_id', project)
      .order('created_at', { ascending: true })
      .returns<NpcRow[]>();
    if (error) throw new Error(`Could not load NPCs: ${error.message}`);
    return (data ?? []).map((row) =>
      Npc.create({
        id: npcId(row.id),
        projectId: projectId(row.project_id),
        name: row.name,
        role: row.role,
        description: row.description ?? undefined,
        status: row.status,
      }),
    );
  }
}
