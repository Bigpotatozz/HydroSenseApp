import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, CotizacionResumenDTO } from '../dto/cotizaciones/showCotizacion.dto';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private apiUrl = 'https://localhost:7160/api/Cotizacion';

  constructor(private http: HttpClient) { }

  obtenerCotizaciones(): Observable<ApiResponse<CotizacionResumenDTO[]>> {
    return this.http.get<ApiResponse<CotizacionResumenDTO[]>>(this.apiUrl);
  }
}
