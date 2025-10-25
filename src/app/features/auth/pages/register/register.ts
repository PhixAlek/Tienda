import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  step: 'choose' | 'user' | 'admin' = 'choose';
  loading = false;

  nombre = '';
  email = '';
  password = '';
  edad?: number;
  telefono?: string;
  direccion?: string;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  select(type: 'user' | 'admin') {
    this.step = type;
  }

  goBack() {
    if (this.step === 'choose') {
      this.router.navigate(['/login']);
    } else {
      this.step = 'choose';
    }
  }

  submit(form: NgForm) {
    if (!form.valid) return;

    if (this.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    this.loading = true;

    const payload: any = {
      nombre: this.nombre.trim(),
      email: this.email.trim().toLowerCase(),
      password: this.password.trim(),
      role: this.step === 'choose' ? 'user' : this.step
    };

    if (this.step === 'user') {
      if (this.edad) payload.edad = Number(this.edad);
      if (this.telefono?.trim()) payload.telefono = this.telefono.trim();
      if (this.direccion?.trim()) payload.direccion = this.direccion.trim();
    }

    this.auth.registerHttp(payload).subscribe({
      next: ({ token }: { token: string }) => {
        this.auth.applyToken(token);
        this.password = ''; // limpia el campo sensible
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err:HttpErrorResponse ) => {
        this.password = '';
        this.loading = false;

        const message =
          err?.error?.error ||
          (err.status === 409
            ? 'El correo ya está registrado.'
            : err.status === 400
            ? 'Campos inválidos o incompletos.'
            : 'Error inesperado al registrar.');

        alert(message);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
