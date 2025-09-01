import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { Product } from '../../../shared/services/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  @Input() product!: Product;
  @Output() closeDetail = new EventEmitter<void>();

  selectedImage: string = '';
  selectedQuantity: number = 1;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.selectedImage = this.product.images?.[0] || '';
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  closeModal(): void {
    this.closeDetail.emit();
  }

  hasDiscount(): boolean {
    return this.product.priceDiscount !== null && 
           this.product.priceDiscount !== undefined && 
           this.product.priceDiscount > 0;
  }

  getDiscountPercentage(): number {
    if (!this.hasDiscount() || !this.product.priceDiscount) return 0;
    return Math.round(((this.product.price - this.product.priceDiscount) / this.product.price) * 100);
  }

  isOutOfStock(): boolean {
    return this.product.stock <= 0;
  }

  getStockText(): string {
    if (this.product.stock <= 0) return 'Agotado';
    if (this.product.stock <= 5) return `Solo ${this.product.stock} disponibles`;
    return 'En stock';
  }

  formatStoreName(storeName: string): string {
    const nameMap: { [key: string]: string } = {
      'Fibertel': 'Fibertel',
      'polleria': 'Pollería',
      'veterinaria_tomy': 'Veterinaria Tomy'
    };
    return nameMap[storeName] || storeName.charAt(0).toUpperCase() + storeName.slice(1);
  }

  increaseQuantity(): void {
    if (this.selectedQuantity < this.product.stock) {
      this.selectedQuantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  getCurrentPrice(): number {
    return this.hasDiscount() && this.product.priceDiscount 
      ? this.product.priceDiscount 
      : this.product.price;
  }

  getTotalPrice(): number {
    return this.getCurrentPrice() * this.selectedQuantity;
  }

  addToCart(): void {
    if (!this.isOutOfStock()) {
      this.cartService.addToCart(this.product, this.selectedQuantity);
      
      // Mostrar mensaje de confirmación (opcional)
      alert(`${this.selectedQuantity} ${this.product.name} agregado(s) al carrito`);
      // Opcional: cerrar el modal después de agregar
      // this.closeModal();
    }
  }
}