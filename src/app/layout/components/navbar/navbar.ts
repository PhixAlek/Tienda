import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
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

  logout() {
    this.auth.logout();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
