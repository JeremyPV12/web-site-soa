import { Routes } from '@angular/router';
import { MainPageClientComponent } from './features/client/main-page-client/main-page-client.component';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'clientes', component: MainPageClientComponent },
      { path: '', redirectTo: 'clientes', pathMatch: 'full' }
    ]
  },
//   { path: 'login', component: LoginComponent }
];

