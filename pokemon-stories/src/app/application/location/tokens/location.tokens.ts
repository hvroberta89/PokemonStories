import { InjectionToken } from '@angular/core';

import type { LocationRepository } from '../ports/location-repository';

export const LOCATION_REPOSITORY = new InjectionToken<LocationRepository>('LOCATION_REPOSITORY');
