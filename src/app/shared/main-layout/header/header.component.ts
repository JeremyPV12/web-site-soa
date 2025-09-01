import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cart, CartItem, CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { OrderRequest } from '../../dtos/orderRequest';
import { User } from '../../dtos/userDto';

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  cart$: Observable<Cart>;
  showCartDropdown = false;
  authService: AuthService;
  router: Router;
  isLoading = false;
  isOpen = false;
  nameUser = ''
  constructor(private cartService: CartService, authService: AuthService, router: Router) {
    this.cart$ = this.cartService.cart$;
    this.authService = authService;
    this.router = router;
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnInit(): void {
    this.verificLogin();
    this.getProfile()
    if (this.getProfile()) {
      this.nameUser = this.getProfile()!.name[0]+this.getProfile()!.last_name[0]
    }
  }

  closeSession():void{
    this.authService.logout();
  }

  changeState():void{
    this.isOpen = !this.isOpen
  }

  verificLogin():boolean{
    return this.authService.isLoggedIn()
  }

  getProfile():User|null{
    return this.authService.getCurrentUser()
  }

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
    if(!this.authService.isLoggedIn()) {
      this.showCartDropdown = false;
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    
    // Subscribe to the cart$ observable to get the current cart value
    const cartSubscription = this.cart$.subscribe(cart => {
      if(cart.items.length === 0) {
        this.isLoading = false;
        return;
      }

      const request: OrderRequest = {
        products: cart.items.map(item => ({
          productId: item.product.id,
          storeName: item.product.storeName,
          quantity: item.quantity
        }))
      };

      console.log(request);

      this.cartService.createOrder(request).subscribe({
        next: (order) => {
          this.isLoading = false;
          this.cartService.clearCart();
          this.showCartDropdown = false;
          this.router.navigate(['/orders']);
          console.log(order);
          cartSubscription.unsubscribe();
        },
        error: () => {
          this.isLoading = false;
          cartSubscription.unsubscribe();
        }
      });
    });
  }
}
