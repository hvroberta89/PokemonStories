import { inject, Injectable } from '@angular/core';

import type { LocationRepository } from '../../../application/location/ports/location-repository';
import type { ProjectId } from '../../../domain/project/value-objects/project-id';
import { projectId } from '../../../domain/project/value-objects/project-id';
import {
  Location,
  type LocationStatus,
  type LocationType,
} from '../../../domain/location/models/location';
import { locationId } from '../../../domain/location/value-objects/location-id';
import { SUPABASE_CLIENT } from '../../supabase/supabase-client.token';

interface LocationRow {
  readonly id: string;
  readonly project_id: string;
  readonly name: string;
  readonly description: string | null;
  readonly type: LocationType;
  readonly status: LocationStatus;
}

@Injectable()
export class SupabaseLocationRepository implements LocationRepository {
  private readonly supabase = inject(SUPABASE_CLIENT);

  async save(location: Location): Promise<void> {
    const value = location.value;
    const { error } = await this.supabase.from('locations').upsert({
      id: value.id,
      project_id: value.projectId,
      name: value.name,
      description: value.description ?? null,
      type: value.type,
      status: value.status,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(`Could not save location: ${error.message}`);
  }

  async findByProject(project: ProjectId): Promise<readonly Location[]> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('id, project_id, name, description, type, status')
      .eq('project_id', project)
      .order('created_at', { ascending: true })
      .returns<LocationRow[]>();
    if (error) throw new Error(`Could not load locations: ${error.message}`);
    return (data ?? []).map((row) =>
      Location.create({
        id: locationId(row.id),
        projectId: projectId(row.project_id),
        name: row.name,
        description: row.description ?? undefined,
        type: row.type,
        status: row.status,
      }),
    );
  }
}
