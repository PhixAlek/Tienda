import { Component, input, output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../services/product';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {
  // Signals API nativa de Angular 20
  product = input<any | null>(null);
  cancel = output<void>();
  saved = output<void>();

  loading = false;
  nombre = '';
  precio: number | null = null;
  stock: number | null = null;

  private productSvc = inject(ProductService);

  ngOnInit() {
    // 👇 Evita que Angular dispare errores si product() es null
    const prod = this.product();
    if (prod) {
      this.nombre = prod.nombre ?? '';
      this.precio = prod.precio ?? null;
      this.stock = prod.stock ?? null;
    }
  }

 submit(form: NgForm) {
  if (!form.valid) return;

  const isEditing = !!this.product();
  const action = isEditing ? 'actualizar' : 'crear';

  // 🔒 Confirmación antes de enviar
  const confirmed = confirm(`¿Seguro que deseas ${action} este producto?`);
  if (!confirmed) return;

  this.loading = true;

  const payload = {
    nombre: this.nombre.trim(),
    precio: Number(this.precio ?? 0),
    stock: Number(this.stock ?? 0)
  };

  const req = isEditing
    ? this.productSvc.update(this.product().nombre, payload)
    : this.productSvc.create(payload);

  req.subscribe({
    next: () => {
      alert(isEditing ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
      this.saved.emit();
      form.resetForm();
      this.loading = false;
    },
    error: (err: HttpErrorResponse) => {
      console.error(err);
      this.loading = false;
      alert(err.error?.mensaje || 'Error al guardar producto.');
    }
  });
}

  onCancel() {
    this.cancel.emit(); // notifica cancelación
  }
}
