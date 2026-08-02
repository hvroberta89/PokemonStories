import { Provider } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

import { environment } from '../../../environments/environment';
import { SUPABASE_CLIENT } from './supabase-client.token';

export function provideSupabaseInfrastructure(): Provider[] {
  return [
    {
      provide: SUPABASE_CLIENT,
      useFactory: () =>
        createClient(environment.supabase.url, environment.supabase.publishableKey, {
          auth: {
            autoRefreshToken: true,
            detectSessionInUrl: true,
            persistSession: true,
          },
        }),
    },
  ];
}
