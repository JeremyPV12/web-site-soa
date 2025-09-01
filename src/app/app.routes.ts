import { OrdersClientComponent } from './features/client/orders-client/orders-client.component';
import { Routes } from '@angular/router';
import { MainPageClientComponent } from './features/client/main-page-client/main-page-client.component';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminLayoutComponent } from './shared/admin-layout/admin-layout.component';
import { AdminLoginComponent } from './features/auth/admin-login/admin-login.component';
import { DashboardComponent } from './shared/admin/dashboard/dashboard.component';
import { OrderComponent } from './shared/admin/order/order.component';
import { AuthAdminGuard } from './shared/guards/auth-admin.guard';
import { canActivateSignIn, AuthGuard } from './shared/guards/auth-guard';

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
  { 
    path: 'login',
    canActivate: [canActivateSignIn],
    component: LoginComponent 
  },
  { path: 'register',canActivate: [canActivateSignIn], component: RegisterComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthAdminGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'order', component: OrderComponent },
    ],
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent,
  }
];
