import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProductCardModel {
  _id: string;
  nombre: string;
  precio: number;
  stock: number;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard {
  product = input.required<ProductCardModel>();
}
