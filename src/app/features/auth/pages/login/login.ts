import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule, RouterLink],
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

  onSubmit() {
    if (!this.email || !this.password) return alert('Completa email y contraseña.');
    this.loading = true;
    const ok = this.authService.login(this.email, this.password);
    setTimeout(() => {
      this.loading = false;
      ok ? this.router.navigate(['/home']) : alert('Credenciales inválidas.');
    }, 1200);
  }

}
