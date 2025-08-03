import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  ProveedorConComponentesDTO
} from '../dto/proveedores/showProveedores.dto';
import { RegistroProveedorResponse } from '../dto/proveedores/createProveedores.dto';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private url: string = 'https://localhost:7160';

  constructor(private http: HttpClient) { }

  obtenerProveedoresConComponentes(): Observable<ApiResponse<ProveedorConComponentesDTO[]>> {
    return this.http.get<ApiResponse<ProveedorConComponentesDTO[]>>(
      `${this.url}/api/Proveedor/proveedores_componentes`
    );
  }
  obtenerComponentesPorProveedor(idProveedor: number): Observable<any> {
    const headers = { idProveedor: idProveedor.toString() };
    return this.http.get<any>(`${this.url}/api/Proveedor/componentes-por-proveedor`, { headers });
  }

  actualizarInventario(dto: {
    idComponente: number;
    cantidadAdquirida: number;
    precioAdquisicion: number;
  }): Observable<any> {
    return this.http.put<any>(`${this.url}/api/Proveedor/actualizar-inventario`, dto);
  }

  registrarProveedorConComponentes(dto: ProveedorConComponentesDTO): Observable<RegistroProveedorResponse> {
    return this.http.post<RegistroProveedorResponse>(`${this.url}/api/Proveedor/registrar-proveedor`, dto);
  }
}
