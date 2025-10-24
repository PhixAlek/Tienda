import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

type Role = 'admin' | 'staff' | 'user';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  step: 'choose' | 'user' | 'admin' = 'choose';

  // user
  nombre = '';
  email = '';
  password = '';


  // admin
  companyName = '';
  nit = '';

  role: Role = 'user';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  select(type: 'user' | 'admin') {
    this.step = type;
    this.role = type === 'admin' ? 'admin' : 'user';
  }

  submit() {
    if (!this.nombre || !this.email || !this.password) return alert('Completa todos los campos.');
    this.loading = true;

    this.auth.registerHttp({ nombre: this.nombre, email: this.email, password: this.password, role: this.role })
      .subscribe({
        next: ({ token }) => {
          this.auth.applyToken(token);   // se queda logueado tras registrar
          this.loading = false;
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.loading = false;
          alert(err?.error?.error || 'Error al registrar');
        }
      });
  }
}
