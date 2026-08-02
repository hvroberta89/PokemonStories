import { InjectionToken } from '@angular/core';

import { ProjectSessionReader } from '../ports/project-session-reader';

export const PROJECT_SESSION_READER = new InjectionToken<ProjectSessionReader>(
  'PROJECT_SESSION_READER',
);
