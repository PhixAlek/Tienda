import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../features/auth/services/auth';

export const guestOnlyGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

 if (auth.isLoggedIn()) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
