import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../features/auth/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = this.auth.user;
  reloads = this.auth.reloads;
  role = this.auth.role;

  currentTitle = signal<string>('');

  constructor() {
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      console.log('Ruta actual:', url); // ← agrega esto
      if (url.includes('/productos')) this.currentTitle.set('Gestión de productos');
      else this.currentTitle.set('');
      console.log('Título actual:', this.currentTitle());
    });
}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
