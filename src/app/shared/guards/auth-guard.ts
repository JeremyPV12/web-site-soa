import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Si no está autenticado, redirigir al login
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    
    return false;
  }
}

export const canActivateSignIn = () => {
  const authService = inject(AuthService)
  const roter = inject(Router)
  if (authService.isLoggedIn()) {
    roter.navigateByUrl('/')
    return false
    }else{
    return true
  }
}