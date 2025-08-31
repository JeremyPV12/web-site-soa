import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../dtos/userDto';
import { AuthResponse } from '../dtos/authResponseDto';
import { RegisterRequest } from '../dtos/registerRequestDto';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiMain;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkStoredUser();
  }

  /** Verifica si hay datos de usuario guardados en localStorage */
  private checkStoredUser(): void {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }


  /** Iniciar sesión */
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}auth/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
        
        this.currentUserSubject.next({
          _id: response._id,
          username: response.username,
          name: response.name,
          last_name: response.last_name
        });
      }),
      catchError(this.handleError)
    );
  }

  /** Registrar nuevo usuario */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}auth/register`, userData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
        
        this.currentUserSubject.next({
          _id: response._id,
          username: response.username,
          name: response.name,
          last_name: response.last_name
        });
      }),
      catchError(this.handleError)
    );
  }

  /** Cerrar sesión */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /** Verificar si el usuario está autenticado */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired(token);
  }

  /** Obtener el token actual */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Obtener datos del usuario actual */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** Verificar si el token ha expirado */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /** Manejar errores HTTP */
  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos';
          break;
        case 401:
          errorMessage = error.error?.message || 'Credenciales incorrectas';
          break;
        case 409:
          errorMessage = 'El nombre de usuario ya está en uso';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}`;
      }
    }

    console.error('Auth Service Error:', error);
    return throwError(() => ({ ...error, message: errorMessage }));
  };
}