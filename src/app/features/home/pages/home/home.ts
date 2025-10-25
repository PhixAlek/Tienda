import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { UserCard } from '../../../../shared/users/components/user-card/user-card';
import { ProductCard } from '../../../../shared/products/components/product-card/product-card';
import { AuthService } from '../../../auth/services/auth';
import { ProductService } from '../../../products/services/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    UserCard,
    ProductCard
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  private auth = inject(AuthService);
  private productSvc = inject(ProductService);
  private router = inject(Router);

  // Signals
  user = this.auth.user;
  loading = this.auth.loading;
  reloads = this.auth.reloads;
  products = this.productSvc.products;
  productsLoading = this.productSvc.loading;
  productsError = this.productSvc.error;

  ngOnInit() {
    // seguridad de sesión
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // carga usuario + productos
    this.auth.loadUser();
    this.productSvc.getAll();
  }

  reloadUser() {
    this.auth.loadUser();
  }

  logout() {
    this.auth.logout();
  }
}
