import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainService, Product, ProductResponse, ProductFilters } from '../../../shared/services/service.service';
import { CartService } from '../../../shared/services/cart.service';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

interface ProductSection {
  title: string;
  products: Product[];
  storeName?: string;
  showAll?: boolean;
}

@Component({
  selector: 'app-main-page-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductDetailComponent],
  templateUrl: './main-page-client.component.html',
  styleUrl: './main-page-client.component.css'
})
export class MainPageClientComponent implements OnInit {
  allProducts: Product[] = [];
  productSections: ProductSection[] = [];
  loading: boolean = false;
  error: string = '';
  
  // Filtros
  searchTerm: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedCategory: string = '';
  
  // Filtros únicos
  uniqueCategories: string[] = [];

  // Modal de detalles del producto
  selectedProduct: Product | null = null;
  showProductDetail = false;

  constructor(
    private mainService: MainService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.obtenerListadoProductos();
  }

  obtenerListadoProductos(): void {
    this.loading = true;
    this.error = '';
    
    const filters: ProductFilters = {
      page: 1,
      size: 100, // Traemos más productos para poder organizarlos por secciones
      search: this.searchTerm || undefined,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined
    };

    this.mainService.obtenerListadoProductos(filters).subscribe({
      next: (response: ProductResponse) => {
        this.allProducts = response.content;
        this.extractUniqueValues();
        this.organizarProductosPorSecciones();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los productos';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  private extractUniqueValues(): void {
    this.uniqueCategories = [...new Set(this.allProducts.map(p => p.categoryName))];
  }

  private organizarProductosPorSecciones(): void {
    this.productSections = [];

    // Aplicar filtros a todos los productos primero
    let filteredProducts = this.applyCurrentFilters(this.allProducts);

    if (filteredProducts.length === 0) {
      return;
    }

    // 1. Sección de productos con descuento
    const productsWithDiscount = filteredProducts.filter(p => this.hasDiscount(p));
    if (productsWithDiscount.length > 0) {
      this.productSections.push({
        title: 'Descuentos',
        products: productsWithDiscount.slice(0, 6),
        showAll: productsWithDiscount.length > 6
      });
    }

    // 2. Agrupar por tiendas
    const storeGroups = this.groupByStore(filteredProducts);
    Object.keys(storeGroups).forEach(storeName => {
      const storeProducts = storeGroups[storeName];
      this.productSections.push({
        title: this.formatStoreName(storeName),
        products: storeProducts.slice(0, 5),
        storeName: storeName,
        showAll: storeProducts.length > 5
      });
    });
  }

  private applyCurrentFilters(products: Product[]): Product[] {
    let filtered = products;

    // Filtrar por búsqueda de texto
    if (this.searchTerm && this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.categoryName.toLowerCase().includes(searchLower) ||
        (p.brandName && p.brandName.toLowerCase().includes(searchLower))
      );
    }

    // Filtrar por categoría
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.categoryName === this.selectedCategory);
    }

    // Filtrar por precio mínimo
    if (this.minPrice !== null && this.minPrice > 0) {
      filtered = filtered.filter(p => {
        const price = this.hasDiscount(p) && p.priceDiscount ? p.priceDiscount : p.price;
        return price >= this.minPrice!;
      });
    }

    // Filtrar por precio máximo
    if (this.maxPrice !== null && this.maxPrice > 0) {
      filtered = filtered.filter(p => {
        const price = this.hasDiscount(p) && p.priceDiscount ? p.priceDiscount : p.price;
        return price <= this.maxPrice!;
      });
    }

    return filtered;
  }

  private groupByStore(products: Product[]): { [key: string]: Product[] } {
    return products.reduce((groups, product) => {
      const store = product.storeName;
      if (!groups[store]) {
        groups[store] = [];
      }
      groups[store].push(product);
      return groups;
    }, {} as { [key: string]: Product[] });
  }

  private formatStoreName(storeName: string): string {
    // Capitalizar y formatear nombres de tienda
    const nameMap: { [key: string]: string } = {
      'Fibertel': 'Fibertel',
      'polleria': 'Pollería',
      'veterinaria_tomy': 'Veterinaria Tomy'
    };
    return nameMap[storeName] || storeName.charAt(0).toUpperCase() + storeName.slice(1);
  }

  // Métodos de filtrado
  applyFilters(): void {
    this.organizarProductosPorSecciones();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedCategory = '';
    this.organizarProductosPorSecciones();
  }

  // Ver todos los productos de una sección
  verTodosProductos(section: ProductSection): void {
    if (section.storeName) {
      // Si es una sección de tienda, mostrar todos los productos de esa tienda
      const allStoreProducts = this.allProducts.filter(p => p.storeName === section.storeName);
      section.products = allStoreProducts;
    } else if (section.title === 'Descuentos') {
      // Si es la sección de descuentos, mostrar todos los productos con descuento
      const allDiscountProducts = this.allProducts.filter(p => this.hasDiscount(p));
      section.products = allDiscountProducts;
    }
    section.showAll = false;
  }

  // Métodos auxiliares
  hasDiscount(product: Product): boolean {
    return product.priceDiscount !== null && product.priceDiscount !== undefined && product.priceDiscount > 0;
  }

  getDiscountPercentage(product: Product): number {
    if (!this.hasDiscount(product) || !product.priceDiscount) return 0;
    return Math.round(((product.price - product.priceDiscount) / product.price) * 100);
  }

  isOutOfStock(product: Product): boolean {
    return product.stock <= 0;
  }

  isLowStock(product: Product): boolean {
    return product.stock > 0 && product.stock <= 5;
  }

  getMainImage(product: Product): string {
    return product.images && product.images.length > 0 ? product.images[0] : '/assets/images/no-image.png';
  }

  getCurrentPrice(product: Product): number {
    return this.hasDiscount(product) && product.priceDiscount ? product.priceDiscount : product.price;
  }

  // Navegar a una tienda específica
  navigateToStore(storeName: string): void {
    // Aquí puedes implementar la navegación a una página específica de la tienda
    console.log(`Navegando a la tienda: ${storeName}`);
  }

  // Abrir modal de detalles del producto
  openProductDetail(product: Product): void {
    this.selectedProduct = product;
    this.showProductDetail = true;
  }

  // Cerrar modal de detalles del producto
  closeProductDetail(): void {
    this.selectedProduct = null;
    this.showProductDetail = false;
  }

  // Agregar producto al carrito directamente desde la lista
  addToCart(product: Product, event?: Event): void {
    if (event) {
      event.stopPropagation(); // Evitar que se abra el modal de detalles
    }
    
    if (!this.isOutOfStock(product)) {
      this.cartService.addToCart(product, 1);
      
      // Opcional: mostrar notificación
      this.showAddToCartNotification(product.name);
    }
  }

  // Mostrar notificación de producto agregado
  private showAddToCartNotification(productName: string): void {
    // Implementar una notificación toast o modal simple
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.textContent = `${productName} agregado al carrito`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }

  // Verificar si un producto está en el carrito
  isInCart(product: Product): boolean {
    return this.cartService.isInCart(product.id, product.storeName);
  }

  // Obtener cantidad de un producto en el carrito
  getCartQuantity(product: Product): number {
    return this.cartService.getItemQuantity(product.id, product.storeName);
  }
}