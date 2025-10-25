import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from './../../services/product';
interface ProductView {
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
 private productSvc = inject(ProductService);

  // signals derivadas del servicio
  products = this.productSvc.products;
  loading  = this.productSvc.loading;
  error    = this.productSvc.error;

  ngOnInit() {
    // simplemente dispara la carga
    this.productSvc.getAll();
  }
}
