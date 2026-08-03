import type { Location } from '../../../../domain/location/models/location';
import type { LocationRepository } from '../../ports/location-repository';

export class ArchiveLocationHandler {
  constructor(private readonly repository: LocationRepository) {}

  async execute(location: Location): Promise<Location> {
    const archivedLocation = location.archive();
    await this.repository.save(archivedLocation);
    return archivedLocation;
  }
}
