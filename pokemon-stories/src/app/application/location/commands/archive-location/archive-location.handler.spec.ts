import { Location } from '../../../../domain/location/models/location';
import { locationId } from '../../../../domain/location/value-objects/location-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import type { LocationRepository } from '../../ports/location-repository';
import { ArchiveLocationHandler } from './archive-location.handler';

class RecordingLocationRepository implements LocationRepository {
  readonly saved: Location[] = [];

  async save(location: Location): Promise<void> {
    this.saved.push(location);
  }

  async findByProject(): Promise<readonly Location[]> {
    return this.saved;
  }
}

describe('ArchiveLocationHandler', () => {
  it('persists an archived Location without rewriting its identity or description', async () => {
    const repository = new RecordingLocationRepository();
    const handler = new ArchiveLocationHandler(repository);
    const location = Location.create({
      id: locationId('location-1'),
      projectId: projectId('project-1'),
      name: 'Öreg Híd',
      description: 'A folyó feletti régi átkelő.',
      type: 'landmark',
    });

    const archived = await handler.execute(location);

    expect(archived.value).toMatchObject({
      id: 'location-1',
      name: 'Öreg Híd',
      description: 'A folyó feletti régi átkelő.',
      status: 'archived',
    });
    expect(repository.saved).toEqual([archived]);
  });
});
