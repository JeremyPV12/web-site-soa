import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, Observable, retry, timeout } from 'rxjs';
import { ErrorInterceptor } from '../interceptor/error-interceptor';

const API_URL = environment.apiMain;

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    private http: HttpClient,
  ) {}

  obtenerListadoProductos(): Observable<any> {
    return this.http.get<any>(`${API_URL}products`).pipe(
      timeout(30000),
      retry(2)
    );
  }
}
