import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { UserCard } from '../../../../shared/users/components/user-card/user-card';
import { AuthService } from '../../../auth/services/auth';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    UserCard
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  private auth = inject(AuthService);
  user = this.auth.user;
  loading = this.auth.loading;
  reloads = this.auth.reloads;

  private router = inject(Router);

  ngOnInit() {
    // Si no hay sesión, redirige a login
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Si hay sesión, carga usuario simulado
    this.auth.loadUser();
  }

  reloadUser() {
    this.auth.loadUser();
  }

  logout() {

    this.auth.logout();
  }
}
