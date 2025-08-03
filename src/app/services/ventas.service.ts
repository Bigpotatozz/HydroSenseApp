import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDTO, ProductoVentaDTO, VentaDTO, ApiResponse } from '../dto/ventas/createVentas.dto';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private baseUrl = 'https://localhost:7160/api'; 

  constructor(private http: HttpClient) { } 

  getUsuariosNivel2(): Observable<ApiResponse<UsuarioDTO[]>> {
    return this.http.get<ApiResponse<UsuarioDTO[]>>(`${this.baseUrl}/Venta/clientes`); 
  }

  getProductosParaVenta(): Observable<ApiResponse<ProductoVentaDTO[]>> {
    return this.http.get<ApiResponse<ProductoVentaDTO[]>>(`${this.baseUrl}/Venta/productos-venta`); 
  }

  registrarVenta(venta: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/Venta/venta`, venta); 
  }
}
