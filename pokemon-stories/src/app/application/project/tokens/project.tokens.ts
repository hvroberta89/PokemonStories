import { InjectionToken } from '@angular/core';

import { ProjectReader } from '../ports/project-reader';
import { ProjectRepository } from '../ports/project-repository';

export const PROJECT_REPOSITORY =
  new InjectionToken<ProjectRepository>(
    'PROJECT_REPOSITORY',
  );

export const PROJECT_READER =
  new InjectionToken<ProjectReader>(
    'PROJECT_READER',
  );