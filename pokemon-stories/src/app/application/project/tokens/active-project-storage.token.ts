import { InjectionToken } from '@angular/core';

import { ActiveProjectStorage } from '../ports/active-project-storage';

export const ACTIVE_PROJECT_STORAGE = new InjectionToken<ActiveProjectStorage>(
  'ACTIVE_PROJECT_STORAGE',
);
