// src/app/services/cotizacion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CotizacionResumenDTO } from '../dto/cotizaciones/showCotizacion.dto';

export interface ResponderCotizacionDTO {
  Mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class CotizacionService {
  private baseUrl = 'https://localhost:7160/api/cotizacion';

  constructor(private http: HttpClient) { }

  obtenerCotizaciones(): Observable<{ success: boolean; data: CotizacionResumenDTO[] }> {
    return this.http.get<{ success: boolean; data: CotizacionResumenDTO[] }>(this.baseUrl);
  }

  responder(id: number, body: ResponderCotizacionDTO) {
    return this.http.post(`${this.baseUrl}/${id}/responder`, body);
  }

  eliminar(id: number) {
    return this.http.put(`${this.baseUrl}/${id}`, {});
  }
}
