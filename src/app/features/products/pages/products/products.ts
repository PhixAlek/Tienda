import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangeDetectorRef } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class Products implements OnInit {
  loading = true;
  products: Product[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Simulamos carga de productos
    setTimeout(() => {
      this.products = [
        { id: 1, name: 'Monitor 4K', price: 250 },
        { id: 2, name: 'Teclado mecánico', price: 120 },
        { id: 3, name: 'Mouse ergonómico', price: 80 }
      ];
      this.loading = false;

      // Forzamos actualización del template
      this.cdr.detectChanges();
    }, 1500);
  }
}
