import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComponenteInventarioDTO, ApiResponse } from '../dto/inventario/showInventario.dto';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl: string = 'https://localhost:7160/api/Sistema';

  constructor(private http: HttpClient) { }

  getInventarioComponentes(): Observable<ApiResponse<ComponenteInventarioDTO[]>> {
    return this.http.get<ApiResponse<ComponenteInventarioDTO[]>>(`${this.apiUrl}/inventario`);
  }
}
