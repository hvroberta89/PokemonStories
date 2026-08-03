import type { ProjectId } from '../../project/value-objects/project-id';
import type { LocationId } from '../value-objects/location-id';

export type LocationType =
  'region' | 'settlement' | 'building' | 'natural-area' | 'landmark' | 'room' | 'custom';

export type LocationStatus = 'active' | 'archived';

export interface LocationProps {
  readonly id: LocationId;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly description?: string;
  readonly type: LocationType;
  readonly status: LocationStatus;
}

export class Location {
  private constructor(public readonly value: LocationProps) {
    Object.freeze(this);
  }

  static create(
    props: Omit<LocationProps, 'status'> & { readonly status?: LocationStatus },
  ): Location {
    const name = props.name.trim();
    const description = props.description?.trim() || undefined;
    if (!name || name.length > 100) {
      throw new Error('A Helyszín neve 1 és 100 karakter között lehet.');
    }
    if (description && description.length > 500) {
      throw new Error('A Helyszín leírása legfeljebb 500 karakter lehet.');
    }
    return new Location({ ...props, name, description, status: props.status ?? 'active' });
  }

  archive(): Location {
    return Location.create({ ...this.value, status: 'archived' });
  }
}
