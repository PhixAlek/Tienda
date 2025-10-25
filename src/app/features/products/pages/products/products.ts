import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from './../../services/product';
import { ProductList } from '../../components/product-list/product-list';
import { ProductForm } from '../../components/product-form/product-form';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ProductList, ProductForm],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class Products {
  private productSvc = inject(ProductService);

  view = signal<'menu' | 'list' | 'form'>('menu');
  editingProduct = signal<any | null>(null);

  // Vistas
  goToMenu() {
    this.view.set('menu');
    this.editingProduct.set(null);
  }

  goToCreate() {
    this.editingProduct.set(null);
    this.view.set('form');
  }

  goToList() {
    this.view.set('list');
    this.editingProduct.set(null);
  }

  goToEdit(product: any) {
    this.editingProduct.set(product);
    this.view.set('form');
  }

  goBackToList() {
    this.goToList();
    this.productSvc.getAll();
  }

  onProductSaved() {
    this.goToMenu();
    this.productSvc.getAll();
  }
}
