import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './service.service';

export interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });

  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedCart = localStorage.getItem('shopping_cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          this.cartSubject.next(cart);
        } catch (error) {
          console.error('Error al cargar:', error);
        }
      }
    }
  }

  private saveCartToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('shopping_cart', JSON.stringify(this.cartSubject.value));
      } catch (error) {
        console.error('Error al guardar en el local:', error);
      }
    }
  }

  private updateCart(): void {
    const currentCart = this.cartSubject.value;
    const updatedCart: Cart = {
      items: currentCart.items,
      totalItems: currentCart.items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: currentCart.items.reduce((total, item) => total + item.totalPrice, 0)
    };

    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(item =>
      item.product.id === product.id && item.product.storeName === product.storeName
    );

    const price = this.getProductPrice(product);

    if (existingItemIndex > -1) {
      currentCart.items[existingItemIndex].quantity += quantity;
      currentCart.items[existingItemIndex].totalPrice =
      currentCart.items[existingItemIndex].quantity * price;
    } else {
      const newItem: CartItem = {
        product: product,
        quantity: quantity,
        totalPrice: quantity * price
      };
      currentCart.items.push(newItem);
    }

    this.updateCart();
  }

  removeFromCart(productId: number, storeName: string): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(item =>
      !(item.product.id === productId && item.product.storeName === storeName)
    );
    this.updateCart();
  }

  updateQuantity(productId: number, storeName: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId, storeName);
      return;
    }

    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.items.findIndex(item =>
      item.product.id === productId && item.product.storeName === storeName
    );

    if (itemIndex > -1) {
      const price = this.getProductPrice(currentCart.items[itemIndex].product);
      currentCart.items[itemIndex].quantity = quantity;
      currentCart.items[itemIndex].totalPrice = quantity * price;
      this.updateCart();
    }
  }

  clearCart(): void {
    this.cartSubject.next({
      items: [],
      totalItems: 0,
      totalPrice: 0
    });
    this.saveCartToStorage();
  }

  getCart(): Observable<Cart> {
    return this.cart$;
  }

  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }

  private getProductPrice(product: Product): number {
    return product.priceDiscount && product.priceDiscount > 0
      ? product.priceDiscount
      : product.price;
  }

  isInCart(productId: number, storeName: string): boolean {
    const currentCart = this.cartSubject.value;
    return currentCart.items.some(item =>
      item.product.id === productId && item.product.storeName === storeName
    );
  }

  getItemQuantity(productId: number, storeName: string): number {
    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find(item =>
      item.product.id === productId && item.product.storeName === storeName
    );
    return item ? item.quantity : 0;
  }
}