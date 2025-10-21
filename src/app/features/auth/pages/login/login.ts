import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  isLoggedIn = false;
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Si ya hay sesión activa, mostrar spinner y redirigir
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.loading = true;

      // Mostrar spinner durante 2.5 s antes de redirigir
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2500);
    }
  }

  onSubmit() {
    if (!this.email || !this.password) {
      alert('Por favor complete ambos campos.');
      return;
    }

    const ok = this.authService.loginMock(this.email, this.password);

    if (ok) {
      this.loading = true;
      this.isLoggedIn = true;

      // Simula espera visual antes de redirigir
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2500);
    } else {
      alert('Credenciales inválidas (simulación).');
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }
}
