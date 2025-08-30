import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, retry, timeout } from 'rxjs';

const API_URL = environment.apiMain;

export interface Product {
  id: number;
  categoryId?: number;
  brandId?: number;
  name: string;
  categoryName: string;
  brandName?: string | null;
  description: string;
  price: number;
  priceDiscount?: number | null;
  storeName: string;
  discount?: number | null;
  stock: number;
  state?: boolean;
  images: string[];
}

export interface ProductResponse {
  content: Product[];
  totalElements: number;
  number: number;
  size: number;
  totalPages: number;
}

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) {}

  obtenerListadoProductos(filters?: ProductFilters): Observable<ProductResponse> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.size) params = params.set('size', filters.size.toString());
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get<ProductResponse>(`${API_URL}products`, { params }).pipe(
      timeout(30000),
      retry(2)
    );
  }

  obtenerProductosPorTienda(storeName: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}products/store/${storeName}`).pipe(
      timeout(30000),
      retry(2)
    );
  }

  obtenerProductosPorCategoria(categoryId: string, store: string): Observable<ProductResponse> {
    const params = new HttpParams().set('store', store);
    return this.http.get<ProductResponse>(`${API_URL}products/category/${categoryId}`, { params }).pipe(
      timeout(30000),
      retry(2)
    );
  }

  obtenerProducto(id: string, store: string): Observable<Product> {
    const params = new HttpParams().set('store', store);
    return this.http.get<Product>(`${API_URL}products/${id}`, { params }).pipe(
      timeout(30000),
      retry(2)
    );
  }
}