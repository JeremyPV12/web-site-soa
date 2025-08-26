import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const API_URL_FIBERTEL = environment.apiFibertel;

@Injectable({
  providedIn: 'root'
})
export class FibertelService {

  constructor(
    private http: HttpClient
  ) {}


}
