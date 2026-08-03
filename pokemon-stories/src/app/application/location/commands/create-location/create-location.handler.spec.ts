import type { Location } from '../../../../domain/location/models/location';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { FixedIdGenerator } from '../../../../infrastructure/shared/identifiers/fixed-id.generator';
import type { LocationRepository } from '../../ports/location-repository';
import { CreateLocationHandler } from './create-location.handler';

class RecordingLocationRepository implements LocationRepository {
  readonly saved: Location[] = [];

  async save(location: Location): Promise<void> {
    this.saved.push(location);
  }

  async findByProject(): Promise<readonly Location[]> {
    return this.saved;
  }
}

describe('CreateLocationHandler', () => {
  it('creates a normalized active Location for an existing Project', async () => {
    const repository = new RecordingLocationRepository();
    const handler = new CreateLocationHandler(
      async () => true,
      repository,
      new FixedIdGenerator('location-1'),
    );

    const result = await handler.execute({
      projectId: projectId('project-1'),
      name: '  Öreg Híd  ',
      description: '  A folyó feletti régi átkelő. ',
      type: 'landmark',
    });

    expect(result.isSuccess).toBe(true);
    expect(repository.saved[0]?.value).toMatchObject({
      name: 'Öreg Híd',
      description: 'A folyó feletti régi átkelő.',
      type: 'landmark',
      status: 'active',
    });
  });

  it('does not save a Location with an empty name', async () => {
    const repository = new RecordingLocationRepository();
    const handler = new CreateLocationHandler(
      async () => true,
      repository,
      new FixedIdGenerator('location-1'),
    );

    const result = await handler.execute({ projectId: projectId('project-1'), name: ' ' });

    expect(result).toEqual({ isSuccess: false, code: 'INVALID' });
    expect(repository.saved).toHaveLength(0);
  });
});
