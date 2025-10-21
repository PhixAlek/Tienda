import { Routes } from '@angular/router';
import { Home } from './features/home/pages/home/home';
import { Login } from './features/auth/pages/login/login';
import { Products } from './features/products/pages/products/products';
import { Layout } from './layout/layout/layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'home', component: Home },
      { path: 'productos', component: Products }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
