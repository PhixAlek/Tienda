import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Product {
  _id: string;
  nombre: string;
  precio: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  private readonly API = 'http://localhost:3000/products';

  // signals reactivas
  private _products = signal<Product[]>([]);
  private _loading  = signal(false);
  private _error    = signal<string | null>(null);

  // computed (solo lectura para los componentes)
  products = computed(() => this._products());
  loading  = computed(() => this._loading());
  error    = computed(() => this._error());

  constructor() {}

  /** Obtiene todos los productos desde la API */
  getAll() {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Product[]>(this.API).subscribe({
      next: (data) => {
        this._products.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this._error.set('No se pudieron obtener los productos.');
        this._loading.set(false);
      }
    });
  }

  /** Busca producto por nombre */
  getByName(nombre: string) {
    return this.http.get<Product>(`${this.API}/${nombre}`);
  }

  /** Crea un nuevo producto (solo admin/staff) */
  create(product: { nombre: string; precio: number; stock?: number }) {
    return this.http.post<Product>(this.API, product);
  }

  /** Actualiza un producto existente por nombre */
  update(nombre: string, changes: Partial<Product>) {
    return this.http.put<Product>(`${this.API}/${nombre}`, changes);
  }

  /** Elimina un producto */
  delete(nombre: string) {
    return this.http.delete<{ mensaje: string }>(`${this.API}/${nombre}`);
  }
}
