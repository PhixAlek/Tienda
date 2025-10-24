import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../features/auth/services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    // El portero: antes de cada request, pega el token si existe
  const auth = inject(AuthService);
  const token = auth.getToken(); // lee de localStorage

  if (token) {
    const withAuth = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` } // Bearer <token>
    });
    return next(withAuth);
  }

  return next(req);
};
