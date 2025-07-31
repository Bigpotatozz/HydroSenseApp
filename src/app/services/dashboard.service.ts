// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoPorMesDTO, VentasPorVendedorDTO, VentasPorMesDTO, ApiResponse } from '../dto/dashboard/showDashboards.dto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl: string = 'https://localhost:7160/api/Dashboard';

  constructor(private http: HttpClient) { }

  getProductosPorMes(mes: number, anio: number): Observable<ApiResponse<ProductoPorMesDTO[]>> {
    return this.http.get<ApiResponse<ProductoPorMesDTO[]>>(`${this.apiUrl}/productos-por-mes?mes=${mes}&anio=${anio}`);
  }

  getVentasPorVendedor(mes: number, anio: number): Observable<ApiResponse<VentasPorVendedorDTO[]>> {
    return this.http.get<ApiResponse<VentasPorVendedorDTO[]>>(`${this.apiUrl}/ventas-por-vendedor?mes=${mes}&anio=${anio}`);
  }

  getVentasPorMes(anio: number): Observable<ApiResponse<VentasPorMesDTO[]>> {
    return this.http.get<ApiResponse<VentasPorMesDTO[]>>(`${this.apiUrl}/ventas-por-mes?anio=${anio}`);
  }
}
