import type { Provider } from '@angular/core';

import { LOCATION_REPOSITORY } from '../../application/location/tokens/location.tokens';
import { SupabaseLocationRepository } from './repositories/supabase-location.repository';

export function provideLocationInfrastructure(): Provider[] {
  return [
    SupabaseLocationRepository,
    { provide: LOCATION_REPOSITORY, useExisting: SupabaseLocationRepository },
  ];
}
