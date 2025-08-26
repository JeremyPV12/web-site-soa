import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const API_URL_INVERSIONES = environment.apiVeterinariaTommy;

@Injectable({
  providedIn: 'root'
})
export class VeterinariaTommyService {

  constructor(
    private http: HttpClient
  ) {}
}
