import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideProjectInfrastructure } from './infrastructure/project/project.providers';
import { provideAdventureInfrastructure } from './infrastructure/adventure/adventure.providers';
import { provideCharacterInfrastructure } from './infrastructure/character/character.providers';
import { provideSupabaseInfrastructure } from './infrastructure/supabase/supabase.providers';
import { provideSessionInfrastructure } from './infrastructure/session/session.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    ...provideSupabaseInfrastructure(),
    ...provideProjectInfrastructure(),
    ...provideAdventureInfrastructure(),
    ...provideCharacterInfrastructure(),
    ...provideSessionInfrastructure(),
  ],
};
