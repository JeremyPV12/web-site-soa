import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cart, CartItem, CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  cart$: Observable<Cart>;
  showCartDropdown = false;

  constructor(private cartService: CartService) {
    this.cart$ = this.cartService.getCart();
  }

  ngOnInit(): void {}

  toggleCartDropdown(): void {
    this.showCartDropdown = !this.showCartDropdown;
  }

  getProductImage(product: any): string {
    return product.images && product.images.length > 0 
      ? product.images[0] 
      : '/assets/images/no-image.png';
  }

  formatStoreName(storeName: string): string {
    const nameMap: { [key: string]: string } = {
      'Fibertel': 'Fibertel',
      'polleria': 'Pollería',
      'veterinaria_tomy': 'Veterinaria Tomy'
    };
    return nameMap[storeName] || storeName.charAt(0).toUpperCase() + storeName.slice(1);
  }

  getCurrentPrice(product: any): number {
    return product.priceDiscount && product.priceDiscount > 0 
      ? product.priceDiscount 
      : product.price;
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.product.stock) {
      this.cartService.updateQuantity(item.product.id, item.product.storeName, item.quantity + 1);
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.product.storeName, item.quantity - 1);
    }
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id, item.product.storeName);
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    this.showCartDropdown = false;
    // Aquí puedes implementar la navegación al checkout
    console.log('Proceder al checkout');
    alert('Funcionalidad de checkout en desarrollo');
  }
}