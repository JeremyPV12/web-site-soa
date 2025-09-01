import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { OrderResponse, UserInfo } from '../../dtos/orderResponseDto';

@Component({
  selector: 'app-order',
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';

    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las órdenes';
        this.loading = false;
        console.error('Error loading orders:', error);
      },
    });
  }

  getOrderDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Entregado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Vacío':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  getTotalOrderAmount(order: OrderResponse): number {
    return order.orders.reduce((total, item) => {
      return total + (item.orderDetails?.total || 0);
    }, 0);
  }

  getShortOrderId(orderId: string): string {
    return orderId.slice(-3);
  }

  getShortUserId(userId: string): string {
    return userId.slice(-3);
  }
}
