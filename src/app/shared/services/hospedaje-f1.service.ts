import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const API_URL_HOSPEDAJE = environment.apiHospedajeF1;

@Injectable({
  providedIn: 'root'
})
export class HospedajeF1Service {

  constructor(
    private http: HttpClient
  ) {}
}
