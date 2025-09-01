import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ChildOrder, ParentOrder, Product } from '../models/order-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderClientService {

  private readonly API_URL = environment.apiMain + 'orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getOrders(): Observable<ParentOrder[]> {
    return this.http.get<any[]>(this.API_URL, { headers: this.getAuthHeaders() }).pipe(
      switchMap(res => {
        console.log('Respuesta principal:', res);

        const parentRequests = res.map(parent => {
          if (!parent.orders || parent.orders.length === 0) {
            return of({
              id: parent.id,
              userId: parent.userId,
              createdAt: parent.createdAt,
              total: 0,
              orders: [],
            } as ParentOrder);
          }

          const childRequests = parent.orders.map((o: any) =>
            this.http.get<any>(`${this.API_URL}/${o.storeName}/${o.orderId}`, { headers: this.getAuthHeaders() }).pipe(
              map(orderDetail => {
                const products: Product[] = (orderDetail.orderDetails || []).map((p: any) => ({
                  name: p.productName,
                  subtotal: p.subtotal,
                  quantity: p.quantity,
                  unitPrice: p.price,
                  productStatus: orderDetail.status === 'Entregado' ? 'Entregado' : 'En Proceso'
                }));

                return {
                  idOrder: o.orderId,
                  date: new Date(parent.createdAt).toISOString().split('T')[0],
                  total: orderDetail.total,
                  status: orderDetail.status,
                  products
                } as ChildOrder;
              })
            )
          );

          return forkJoin<ChildOrder[]>(childRequests).pipe(
            map((childOrders: ChildOrder[]) => {
              const parentTotal = childOrders.reduce((acc, c) => acc + c.total, 0); // 👈 sumamos los totales

              return {
                id: parent.id,
                userId: parent.userId,
                createdAt: parent.createdAt,
                total: parentTotal,
                orders: childOrders
              } as ParentOrder;
            })
          );
        });

        return forkJoin(parentRequests);
      })
    );
  }
}
