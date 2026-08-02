import { InjectionToken } from '@angular/core';

import { ActiveRunningSessionReader } from '../ports/active-running-session-reader';

export const ACTIVE_RUNNING_SESSION_READER = new InjectionToken<ActiveRunningSessionReader>(
  'ACTIVE_RUNNING_SESSION_READER',
);
