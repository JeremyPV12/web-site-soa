import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { OrderResponse, OrderDetailResponse } from '../dtos/orderResponseDto';
import { environment } from '../../../environments/environment';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiMain}orders/admin`;
  private orderDetailUrl = `${environment.apiMain}orders`;

  constructor(private http: HttpClient) {}

  // Por cada order traer su detalle
  getOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.apiUrl).pipe(
      switchMap((orders) => {
        const ordersWithDetails = orders.map((order) =>
          this.getOrderDetails(order).pipe(
            catchError((error) => {
              console.error('Error loading order details:', error);
              return [
                {
                  ...order,
                  overallStatus: this.calculateOverallStatusFromItems(
                    order.orders
                  ),
                  orders: order.orders.map((item) => ({ ...item })),
                },
              ];
            })
          )
        );

        return forkJoin(ordersWithDetails);
      })
    );
  }

  // Detalles para una orden id
  private getOrderDetails(order: OrderResponse): Observable<OrderResponse> {
    if (order.orders.length === 0) {
      return new Observable((observer) => {
        observer.next({
          ...order,
          overallStatus: 'Vacío',
        });
        observer.complete();
      });
    }
    // por cada id trae  detalles individuales
    const detailRequests = order.orders.map((item) =>
      this.getOrderDetail(item.storeName, item.orderId).pipe(
        map((detail) => ({ ...item, orderDetails: detail })),
        catchError((error) => {
          console.error(
            `Error loading detail for ${item.storeName}-${item.orderId}:`,
            error
          );
          return [{ ...item }];
        })
      )
    );

    // Junta los detalles y ve estado general de todo
    return forkJoin(detailRequests).pipe(
      map((itemsWithDetails) => {
        const overallStatus = this.calculateOverallStatus(itemsWithDetails);
        return {
          ...order,
          orders: itemsWithDetails,
          overallStatus,
          user: order.user,
        };
      })
    );
  }

  // Obtiene detalles de un pedido (store + orderId)
  private getOrderDetail(
    storeName: string,
    orderId: string
  ): Observable<OrderDetailResponse> {
    const url = `${this.orderDetailUrl}/${storeName}/${orderId}`;
    return this.http.get<OrderDetailResponse>(url);
  }

  // Ve estado general dependiendo de los individuales
  private calculateOverallStatus(items: any[]): string {
    if (items.length === 0) return 'Vacío';

    const statuses = items.map(
      (item) => item.orderDetails?.status || 'Desconocido'
    );

    if (statuses.some((status) => status === 'Pendiente')) return 'Pendiente';
    if (statuses.every((status) => status === 'Entregado')) return 'Entregado';

    return 'Pendiente';
  }

  private calculateOverallStatusFromItems(items: any[]): string {
    if (items.length === 0) return 'Vacío';
    return 'Pendiente';
  }
}
