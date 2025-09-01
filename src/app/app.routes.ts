import { OrdersClientComponent } from './features/client/orders-client/orders-client.component';
import { Routes } from '@angular/router';
import { MainPageClientComponent } from './features/client/main-page-client/main-page-client.component';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'clientes', component: MainPageClientComponent },
      { path: 'orders-client', component: OrdersClientComponent },
      { path: '', redirectTo: 'clientes', pathMatch: 'full' }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

