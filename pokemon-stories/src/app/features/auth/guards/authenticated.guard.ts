import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../services/auth.store';

export const authenticatedGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  try {
    await auth.ready;
  } catch {
    return router.createUrlTree(['/auth']);
  }

  return auth.isAuthenticated()
    ? true
    : router.createUrlTree(['/auth'], { queryParams: { returnUrl: state.url } });
};
