import { InjectionToken } from '@angular/core';

import { SessionCloudRepository } from '../ports/session-cloud-repository';

export const SESSION_CLOUD_REPOSITORY = new InjectionToken<SessionCloudRepository>(
  'SESSION_CLOUD_REPOSITORY',
  {
    providedIn: 'root',
    factory: () => ({
      save: async () => undefined,
      findRestorable: async () => null,
      findByProject: async () => null,
      listCompletedByProject: async () => [],
      findCompletedById: async () => null,
    }),
  },
);
