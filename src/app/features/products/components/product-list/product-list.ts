import { Component, signal, effect, output, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
  private productSvc = inject(ProductService);

  cancel = output<void>();
  edit = output<any>();

  displayedColumns = ['nombre', 'precio', 'stock', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    // cuando cambia el signal products, actualiza la tabla
    effect(() => {
      const products = this.productSvc.products();
      this.dataSource.data = products ?? [];
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  goBack() {
    this.cancel.emit();
  }

  onEdit(product: any) {
    this.edit.emit(product);
  }

  onDelete(product: any) {
    if (confirm(`¿Seguro que deseas eliminar "${product.nombre}"?`)) {
      this.productSvc.delete(product.nombre).subscribe({
        next: () => {
          alert('Producto eliminado correctamente');
          this.productSvc.getAll(); // recarga
        },
        error: (err) => {
          alert(err?.error?.mensaje || 'Error eliminando producto');
        }
      });
    }
  }
}
