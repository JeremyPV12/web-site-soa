import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentOrder } from '../../../shared/models/order-client';
import { OrderClientService } from '../../../shared/services/order-client.service';
@Component({
  selector: 'app-orders-client',
  imports: [
    CommonModule
  ],
  templateUrl: './orders-client.component.html',
  styleUrls: ['./orders-client.component.css']
})
export class OrdersClientComponent implements OnInit {
  parentOrders: ParentOrder[] = [];
  isDetailsOpen: { [key: string]: boolean } = {};
  loading = true;

  constructor(private ordersService: OrderClientService) {}

  ngOnInit() {
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        console.log('Órdenes finales:', data);
        this.parentOrders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando órdenes:', err);
        this.loading = false;
      }
    });
  }

  toggleDetails(parentId: string) {
    this.isDetailsOpen[parentId] = !this.isDetailsOpen[parentId];
  }
}
