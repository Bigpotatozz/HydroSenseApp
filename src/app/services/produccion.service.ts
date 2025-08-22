import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SistemaProduccionDTO, ApiResponse } from '../dto/produccion/showSistemasProduccion.dto';

@Injectable({ providedIn: 'root' })
export class ProduccionService {
  private apiUrl = 'https://localhost:7160/api/Sistema';

  constructor(private http: HttpClient) { }

  obtenerSistemasProduccion(): Observable<ApiResponse<SistemaProduccionDTO[]>> {
    return this.http.get<ApiResponse<SistemaProduccionDTO[]>>(`${this.apiUrl}/sistemas-produccion`);
  }

  producirSistema(idSistema: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/producir/${idSistema}`, {});
  }

  obtenerComponentesParaConstruccion(): Observable<ApiResponse<Array<{ id: number; nombre: string; tipo: 'componente' | 'sistema'; precio: number }>>> {
    return this.http.get<ApiResponse<Array<{ id: number; nombre: string; tipo: 'componente' | 'sistema'; precio: number }>>>(`${this.apiUrl}/componentes-disponibles`);
  }

  crearSistema(dto: {
    nombreSistema: string;
    descripcion: string;
    nombreFabricante: string;
    urlImagen: string;
    cantidad: number;
    componentes: Array<{ idComponente: number; cantidadRequerida: number }>;
  }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/crear-sistema`, dto);
  }
}
