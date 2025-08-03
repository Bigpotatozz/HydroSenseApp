import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SistemaProduccionDTO, ApiResponse } from '../dto/produccion/showSistemasProduccion.dto';

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {
  private apiUrl = 'https://localhost:7160/api/Sistema'; 

  constructor(private http: HttpClient) { }

  obtenerSistemasProduccion(): Observable<ApiResponse<SistemaProduccionDTO[]>> {
    return this.http.get<ApiResponse<SistemaProduccionDTO[]>>(`${this.apiUrl}/sistemas-produccion`);
  }

  producirSistema(idSistema: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/producir/${idSistema}`, {});
  }
}
