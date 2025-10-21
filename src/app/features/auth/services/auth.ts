import { Injectable, signal, computed } from '@angular/core';

type Role = 'admin' | 'user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // Mantén esta constante: define la clave de almacenamiento local
  private readonly KEY_TOKEN = 'auth_token_demo';
  private readonly KEY_ROLE  = 'auth_role_demo';

  // Signals: estado reactivo global
  private _user = signal<{ name: string; email: string } | null>(null);
  private _role = signal<Role | null>(null);

  reloads = signal(0);
  loading = signal(false);

  user = computed(() => this._user());
  role = computed(() => this._role());

    constructor() {
    const token = localStorage.getItem(this.KEY_TOKEN);
    const role = localStorage.getItem(this.KEY_ROLE) as Role | null;

    if (token) {
      this._user.set({ name: 'Usuario', email: 'user@finbit.dev' });
      if (role === 'admin' || role === 'user') this._role.set(role);
    }
  }


  // Carga de usuario simulado
  loadUser() {
    this.loading.set(true);

    setTimeout(() => {
      this._user.set({ name: 'Alek Segura', email: 'alek@test.dev' });
      this.reloads.update(v => v + 1);
      this.loading.set(false);
    }, 1500);
  }

  // Simulación simple de login
  loginMock(email: string, password: string): boolean {
        if (!email || !password) return false;

    const asAdmin = /admin/i.test(email);
    const role: Role = asAdmin ? 'admin' : 'user';

    localStorage.setItem(this.KEY_TOKEN, 'demo-token');
    localStorage.setItem(this.KEY_ROLE, role);

    this._user.set({ name: asAdmin ? 'Admin FinBit' : 'Usuario FinBit', email });
    this._role.set(role);
    return true;
  }

  // Cierre de sesión
  logout() {
     localStorage.removeItem(this.KEY_TOKEN);
    localStorage.removeItem(this.KEY_ROLE);
    this._user.set(null);
    this._role.set(null);
  }

  // Verificación de sesión
  isLoggedIn(): boolean {
    const validSession = !!localStorage.getItem(this.KEY_TOKEN);
    console.log('isLoggedIn:', validSession);
    return validSession;
  }

   isAdmin(): boolean {
    return this._role() === 'admin';
  }
}

