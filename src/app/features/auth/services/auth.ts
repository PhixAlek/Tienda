import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, inject } from '@angular/core';

type Role = 'admin' | 'user' | 'staff';

interface LoginDto { email: string; password: string; }
interface RegisterDto { nombre: string; email: string; password: string; role?: Role; }
interface TokenResponse { token: string; }

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
  private _exp  = signal<number | null>(null);

  reloads = signal(0);
  loading = signal(false);

  user = computed(() => this._user());
  role = computed(() => this._role());
  exp  = computed(() => this._exp());

  private http = inject(HttpClient);
  private API = 'http://localhost:3000';

  loadUser() {
    this.loading.set(true);
    setTimeout(() => {
      this.reloads.update(v => v + 1);
      this.loading.set(false);
    }, 1500);
  }

 // ---------------------------
  // Sesión: set desde un token
  // ---------------------------
  private setSessionFromToken(token: string) {
    // 1) Persistimos para interceptor/guards
    localStorage.setItem(this.KEY_TOKEN, token);

    // 2) Decodificamos payload para extraer datos
    //    token = header.payload.signature
    try {
      const payload = token.split('.')[1];             // toma la 2da parte del JWT
      const decoded = JSON.parse(atob(payload));       // Base64 → JSON
      // decoded = { id, email, role, iat, exp }

      // 3) Role legacy (si otros lugares lo usan)
      if (decoded?.role) localStorage.setItem(this.KEY_ROLE, decoded.role);

      // 4) Signals de app
      const name = decoded?.email ? decoded.email.split('@')[0] : 'Usuario';
      this._user.set({ name, email: decoded?.email || '' });
      this._role.set(decoded?.role ?? null);
      this._exp.set(typeof decoded?.exp === 'number' ? decoded.exp : null);
    } catch {
      // Si está corrupto, se borra y queda sin sesión
      this.logout();
    }
  }

  // ---------------------------
  // Login real (POST /auth/login)
  // ---------------------------
  loginHttp(dto: LoginDto) {
    // Devolvemos el observable para suscribirse desde el componente
    return this.http.post<TokenResponse>(`${this.API}/auth/login`, dto);
  }

  // ------------------------------
  // Register real (POST /auth/register)
  // ------------------------------
  registerHttp(dto: RegisterDto) {
    return this.http.post<TokenResponse>(`${this.API}/auth/register`, dto);
  }

  // ---- Helpers de sesión ----
  getToken(): string | null {
    return localStorage.getItem(this.KEY_TOKEN);
  }

  getDecoded(): any | null {
    const t = this.getToken();
    if (!t) return null;
    try {
      return JSON.parse(atob(t.split('.')[1]));
    } catch {
      return null;
    }
  }

 // Cierre de sesión
  logout() {
    localStorage.removeItem(this.KEY_TOKEN);
    localStorage.removeItem(this.KEY_ROLE);
    this._user.set(null);
    this._role.set(null);
    this._exp.set(null);
  }

  // Verificación de sesión

  isLoggedIn(): boolean {
    const d = this.getDecoded();
    if (!d) return false;
    // Check exp en el cliente para UX (el backend siempre valida igual)
    if (typeof d.exp === 'number' && d.exp * 1000 < Date.now()) {
      this.logout();
      return false;
    }
    return true;
  }

  isAdmin(): boolean {
    const d = this.getDecoded();
    return d?.role === 'admin';
  }

   // Expuesto para componentes: setea sesión tras recibir token desde login/register
  applyToken(token: string) {
    this.setSessionFromToken(token);
  }

}


