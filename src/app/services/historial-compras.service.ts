import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ClienteDto {
  idUsuario: number;
  nombreCompleto: string;
}

export interface CompraItemDto {
  tipo: 'sistema' | 'componente';
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  totalLinea: number;
}

export interface VentaClienteDto {
  idVenta: number;
  fechaHora: string;   // ISO
  items: CompraItemDto[];
  totalVenta: number;
}

export interface ComprasClienteResponse {
  cliente: ClienteDto;
  ventas: VentaClienteDto[];
}

@Injectable({
  providedIn: 'root'
})
export class HistorialComprasService {
  private apiUrl = 'https://localhost:7160/api/Venta';

  constructor(private http: HttpClient) { }

  getComprasCliente(idCliente: number): Observable<ApiResponse<ComprasClienteResponse>> {
    return this.http.get<ApiResponse<ComprasClienteResponse>>(
      `${this.apiUrl}/compras-cliente/${idCliente}`
    );
  }
}
