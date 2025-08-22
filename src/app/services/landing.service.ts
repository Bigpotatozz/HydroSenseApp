import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductoDisponible {
  id: number;
  nombre: string;
  tipo: 'sistema' | 'componente';
  precio: number;
}
export interface ApiResponse<T> { success: boolean; message: string; data: T; }

@Injectable({ providedIn: 'root' })
export class LandingService {
  private url = 'https://localhost:7160';

  constructor(private http: HttpClient) { }

  getProductosCotizacion(): Observable<ApiResponse<ProductoDisponible[]>> {
    return this.http.get<ApiResponse<ProductoDisponible[]>>(`${this.url}/api/Cotizacion/productos`);
  }

  postCotizacion(cotizacion: any) {
    return this.http.post(`${this.url}/api/Cotizacion`, cotizacion);
  }
}
