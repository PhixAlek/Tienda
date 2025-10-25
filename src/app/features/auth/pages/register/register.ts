import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatIconModule } from '@angular/material/icon';

type Role = 'admin' | 'staff' | 'user';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  step: 'choose' | 'user' | 'admin' = 'choose';
  loading = false;

  // user
  name = '';
  email = '';
  password = '';


  // admin
  companyName = '';
  nit = '';

  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  select(type: 'user' | 'admin') { this.step = type; }

  submitUser() {
    if (!this.name || !this.email || !this.password) return alert('Completa todos los campos.');
    this.loading = true;
    const ok = this.auth.register({ name: this.name, email: this.email, password: this.password, type: 'user' });
    setTimeout(() => { this.loading = false; ok ? this.router.navigate(['/home']) : alert('Error al registrar'); }, 1000);
  }

  submitAdmin() {
    if (!this.companyName || !this.email || !this.password || !this.nit) return alert('Completa todos los campos de empresa.');
    this.loading = true;
    const ok = this.auth.register({ name: this.companyName, email: this.email, password: this.password, type: 'admin' });
    setTimeout(() => { this.loading = false; ok ? this.router.navigate(['/home']) : alert('Error al registrar'); }, 1000);
  }
}
