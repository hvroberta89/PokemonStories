import type { LocationType } from '../../../../domain/location/models/location';
import { Location } from '../../../../domain/location/models/location';
import { locationId } from '../../../../domain/location/value-objects/location-id';
import type { ProjectId } from '../../../../domain/project/value-objects/project-id';
import type { IdGenerator } from '../../../shared/ports/id-generator';
import type { LocationRepository } from '../../ports/location-repository';

export interface CreateLocationCommand {
  readonly projectId: ProjectId;
  readonly name: string;
  readonly description?: string;
  readonly type?: LocationType;
}

export type CreateLocationResult =
  | { readonly isSuccess: true; readonly value: Location }
  | { readonly isSuccess: false; readonly code: 'PROJECT_NOT_FOUND' | 'INVALID' };

export class CreateLocationHandler {
  constructor(
    private readonly projectExists: (projectId: ProjectId) => Promise<boolean>,
    private readonly repository: LocationRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(command: CreateLocationCommand): Promise<CreateLocationResult> {
    if (!(await this.projectExists(command.projectId))) {
      return { isSuccess: false, code: 'PROJECT_NOT_FOUND' };
    }
    try {
      const location = Location.create({
        id: locationId(this.ids.generate()),
        projectId: command.projectId,
        name: command.name,
        description: command.description,
        type: command.type ?? 'custom',
      });
      await this.repository.save(location);
      return { isSuccess: true, value: location };
    } catch {
      return { isSuccess: false, code: 'INVALID' };
    }
  }
}
