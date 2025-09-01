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
  orderStatus: {orderId: string, isDelivered: boolean} = {orderId: "", isDelivered: false};

  constructor(private ordersService: OrderClientService) {}

  ngOnInit() {
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        console.log('Órdenes finales:', data);
        this.parentOrders = data;
        data.forEach(order => {
          const pendingOrders = order.orders.filter(order => order.status.toLowerCase() === "pendiente");
          console.log(pendingOrders);
          console.log(order.orders);
          if(pendingOrders.length > 0){
            this.orderStatus = {orderId: order.id, isDelivered: false};
          }else{
            this.orderStatus = {orderId: order.id, isDelivered: true};
          }
        });
        
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
