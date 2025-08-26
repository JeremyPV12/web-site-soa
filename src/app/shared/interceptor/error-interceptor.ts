import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error de conexión: ${error.error.message}`;
          console.error('Error del cliente:', error.error.message);
        } else {
          switch (error.status) {
            case 400:
              errorMessage = 'Solicitud inválida. Verifique los datos enviados.';
              break;
            case 401:
              errorMessage = 'No autorizado. Inicie sesión nuevamente.';
              // Opcional: redirigir a login
              const router = this.injector.get(Router);
              router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'No tiene permisos para realizar esta acción.';
              break;
            case 404:
              errorMessage = 'El recurso solicitado no fue encontrado.';
              break;
            case 500:
              errorMessage = 'Error interno del servidor. Intente más tarde.';
              break;
            case 0:
              errorMessage = 'Sin conexión a internet. Verifique su conectividad.';
              break;
            default:
              errorMessage = `Error del servidor (${error.status}): ${error.message}`;
          }
          
          console.error(`Error del servidor - Código: ${error.status}, Mensaje: ${error.message}`);
        }

        // Opcional: Mostrar notificación
        // const notificationService = this.injector.get(NotificationService);
        // notificationService.showError(errorMessage);

        return throwError(() => ({
          message: errorMessage,
          status: error.status,
          originalError: error
        }));
      })
    );
  }
}