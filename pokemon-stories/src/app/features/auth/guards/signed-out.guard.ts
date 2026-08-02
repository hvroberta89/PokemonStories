import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../services/auth.store';

export const signedOutGuard: CanActivateFn = async () => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  try {
    await auth.ready;
  } catch {
    return true;
  }

  return auth.isAuthenticated() ? router.createUrlTree(['/projects']) : true;
};
