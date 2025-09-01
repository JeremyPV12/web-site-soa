import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  stats = [
    { title: 'Total Pedidos', value: '1,234', icon: '📦', color: 'blue' },
    { title: 'Usuarios Activos', value: '567', icon: '👥', color: 'green' },
    { title: 'Ingresos', value: 'S/ 45,678', icon: '💰', color: 'purple' },
    { title: 'Pedidos Pendientes', value: '23', icon: '⏰', color: 'orange' },
  ];
}
