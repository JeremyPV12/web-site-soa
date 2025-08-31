import { Routes } from '@angular/router';
import { MainPageClientComponent } from './features/client/main-page-client/main-page-client.component';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthGuard, canActivateSignIn } from './shared/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'clientes', component: MainPageClientComponent },
      { path: '', redirectTo: 'clientes', pathMatch: 'full' }
    ]
  },
  { 
    path: 'login',
    canActivate: [canActivateSignIn],
    component: LoginComponent 
  },
  { path: 'register',canActivate: [canActivateSignIn], component: RegisterComponent }
];



