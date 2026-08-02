import { inject, Injectable } from '@angular/core';

import { ProjectReader } from '../../../application/project/ports/project-reader';
import { ProjectRepository } from '../../../application/project/ports/project-repository';
import { Project } from '../../../domain/project/models/project';
import { ProjectStatus } from '../../../domain/project/models/project-status';
import { ProjectId, projectId } from '../../../domain/project/value-objects/project-id';
import { SUPABASE_CLIENT } from '../../supabase/supabase-client.token';

interface ProjectRow {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly status: ProjectStatus;
}

@Injectable()
export class SupabaseProjectRepository implements ProjectRepository, ProjectReader {
  private readonly supabase = inject(SUPABASE_CLIENT);

  async save(project: Project): Promise<void> {
    const ownerId = await this.requireAuthenticatedUserId();
    const { error } = await this.supabase.from('projects').insert({
      id: project.id,
      owner_id: ownerId,
      name: project.name,
      description: project.description ?? null,
      status: project.status,
    });

    if (error) {
      throw new Error(`Could not save project: ${error.message}`);
    }
  }

  async findById(id: ProjectId): Promise<Project | undefined> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('id, name, description, status')
      .eq('id', id)
      .maybeSingle<ProjectRow>();

    if (error) {
      throw new Error(`Could not load project: ${error.message}`);
    }
    return data ? this.restoreProject(data) : undefined;
  }

  async findAll(): Promise<readonly Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('id, name, description, status')
      .order('created_at', { ascending: false })
      .returns<ProjectRow[]>();

    if (error) {
      throw new Error(`Could not load projects: ${error.message}`);
    }
    return (data ?? []).map((row) => this.restoreProject(row));
  }

  async existsByName(name: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('name')
      .eq('name', name.trim())
      .limit(1);

    if (error) {
      throw new Error(`Could not check project name: ${error.message}`);
    }
    return (data?.length ?? 0) > 0;
  }

  private restoreProject(row: ProjectRow): Project {
    const result = Project.restore({
      id: projectId(row.id),
      name: row.name,
      description: row.description ?? undefined,
      status: row.status,
    });

    if (!result.isSuccess) {
      throw new Error(`Stored project ${row.id} violates the domain model.`);
    }
    return result.value;
  }

  private async requireAuthenticatedUserId(): Promise<string> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error || !data.user) {
      throw new Error('An authenticated user is required to save a project.');
    }
    return data.user.id;
  }
}
