// src/app/services/venta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDTO, ProductoVentaDTO, VentaDTO, ApiResponse } from '../dto/ventas/createVentas.dto';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private baseUrl = 'https://localhost:7160/api'; //

  constructor(private http: HttpClient) { } //

  getUsuariosNivel2(): Observable<ApiResponse<UsuarioDTO[]>> {
    // RUTA CORREGIDA: Ahora apunta a /api/Venta/clientes
    return this.http.get<ApiResponse<UsuarioDTO[]>>(`${this.baseUrl}/Venta/clientes`); //
  }

  getProductosParaVenta(): Observable<ApiResponse<ProductoVentaDTO[]>> {
    // RUTA CORREGIDA: Ahora apunta a /api/Venta/productos-venta
    return this.http.get<ApiResponse<ProductoVentaDTO[]>>(`${this.baseUrl}/Venta/productos-venta`); //
  }

  registrarVenta(venta: any): Observable<ApiResponse<any>> {
    // El 'venta' aquí será el 'apiPayload' que construimos en el componente
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/Venta/venta`, venta); //
  }
}
