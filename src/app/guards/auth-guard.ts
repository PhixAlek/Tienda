import { CanActivateFn, Router} from '@angular/router';
import { AuthService } from './../features/auth/services/auth.js';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/login']);

  return false;
};
