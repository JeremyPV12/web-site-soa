import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const API_URL_INVERSIONES = environment.apiPolleria;

@Injectable({
  providedIn: 'root'
})
export class PolleriaService {

  constructor(
    private http: HttpClient
  ) {}
}
