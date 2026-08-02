import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideProjectInfrastructure } from './infrastructure/project/project.providers';
import { provideAdventureInfrastructure } from './infrastructure/adventure/adventure.providers';
import { ACTIVE_RUNNING_SESSION_READER } from './application/session/tokens/active-running-session.tokens';
import { RunningSessionStorageService } from './features/running-session/services/running-session-storage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    ...provideProjectInfrastructure(),
    ...provideAdventureInfrastructure(),
    {
      provide: ACTIVE_RUNNING_SESSION_READER,
      useExisting: RunningSessionStorageService,
    },
  ],
};
