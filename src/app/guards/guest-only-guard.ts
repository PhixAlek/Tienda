import { CanActivateFn } from '@angular/router';

export const guestOnlyGuard: CanActivateFn = (route, state) => {
  return true;
};
