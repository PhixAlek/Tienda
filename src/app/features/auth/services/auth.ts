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
  private _exp  = signal<number | null>(null);

  reloads = signal(0);
  loading = signal(false);

  user = computed(() => this._user());
  role = computed(() => this._role());
  exp  = computed(() => this._exp());

  //   constructor() {
  //   const token = localStorage.getItem(this.KEY_TOKEN);
  //   const role = localStorage.getItem(this.KEY_ROLE) as Role | null;

  //   if (token) {
  //     this._user.set({ name: 'Usuario', email: 'user@finbit.dev' });
  //     if (role === 'admin' || role === 'user') this._role.set(role);
  //   }
  // }

  // Carga de usuario simulado

  loadUser() {
    this.loading.set(true);
    setTimeout(() => {
      this.reloads.update(v => v + 1);
      this.loading.set(false);
    }, 1500);
  }



  // ---- Generación de un JWT simulado (solo para clase) ----
  private makeFakeJWT(payload: object): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body   = btoa(JSON.stringify(payload));
    const sign   = btoa('FinBitFakeSignature'); // solo decorativo
    return `${header}.${body}.${sign}`;
  }

  // ---- Decodificador robusto (payload → objeto) ----
  private readPayload(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const text = atob(parts[1]);
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  // ---- Login simulado con rol según email ----
  login(email: string, password: string): boolean {
    if (!email || !password) return false;

  const asAdmin = /admin/i.test(email);//Es como un detector que revisa el correo del usuario y dice: “Si veo la palabra admin en el correo, lo trataré como administrador”.

    const role: Role = asAdmin ? 'admin' : 'user';

    const exp = Math.floor(Date.now() / 1000) + 60 * 30; // expira en 30 min

    const token = this.makeFakeJWT({ name: email.split('@')[0], email, role, exp });

    // Persistimos para guards/interceptor
    localStorage.setItem(this.KEY_TOKEN, token);
    localStorage.setItem(this.KEY_ROLE, role);

    // Refrescamos signals
    this._user.set({ name: email.split('@')[0], email });
    this._role.set(role);
    this._exp.set(exp);
    return true;
  }

  // ---- Register simulado: emula alta y deja logueado ----
  register(data: { name: string; email: string; password: string; type: Role }): boolean {
    if (!data.name || !data.email || !data.password) return false;
    const exp = Math.floor(Date.now() / 1000) + 60 * 30;
    const token = this.makeFakeJWT({ name: data.name, email: data.email, role: data.type, exp });
    localStorage.setItem(this.KEY_TOKEN, token);
    localStorage.setItem(this.KEY_ROLE, data.type);
    this._user.set({ name: data.name, email: data.email });
    this._role.set(data.type);
    this._exp.set(exp);
    return true;
  }

  // ---- Helpers de sesión ----
  getToken(): string | null {
    return localStorage.getItem(this.KEY_TOKEN);
  }

  getDecoded(): any | null {
    const t = this.getToken();
    return t ? this.readPayload(t) : null;
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

}


