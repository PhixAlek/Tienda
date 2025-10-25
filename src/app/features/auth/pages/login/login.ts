import { Component, signal } from '@angular/core';
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
  loading = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  onSubmit() {
  if (!this.email || !this.password) {
    alert('Completa email y contraseña.');
    return;
  }

  this.loading.set(true);

  this.authService.loginHttp({ email: this.email, password: this.password })
      .subscribe({
        next: ({ token }: { token: string }) => {
          this.authService.applyToken(token);
          this.password = ''; // limpia el campo de seguridad
          this.loading.set(false);
          this.router.navigate(['/home']);
        },
        error: (err: { error?: { error?: string }}) => {
          const message = err?.error?.error || 'Credenciales inválidas';
          this.email = '';
          this.password = '';
          this.loading.set(false);
          alert(message);
        },
        complete: () => {
          this.loading.set(false);
        }
      });
}


}
