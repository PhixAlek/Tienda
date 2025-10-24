import { Routes } from '@angular/router';
import { Home } from './features/home/pages/home/home';
import { Login } from './features/auth/pages/login/login';
import { Products } from './features/products/pages/products/products';
import { Layout } from './layout/layout/layout';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { guestOnlyGuard } from './guards/guest-only-guard';
import { Register } from './features/auth/pages/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [guestOnlyGuard]},
  { path: 'register', component: Register, canActivate: [guestOnlyGuard]},
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: Home},
      { path: 'productos', component: Products, canActivate: [adminGuard] }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
