import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  edad: number;
  pais?: string;
  correo: string;
  telefono: string;
  nivel: string;
}

export interface UsuarioEdicionDTO {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  edad: number;
  pais?: string;
  correo: string;
  telefono: string;
  contrasenia?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private apiUrl = 'https://localhost:7160/api/Usuarios';
  constructor(private http: HttpClient) { }
  getUsuarioPorId(id: number): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/getUsuarios`).pipe(
      map(lista => lista.find(u => u.idUsuario === id) ?? null)
    );
  }
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/getUsuarios`);
  }
  existeCorreo(correo: string, idActual: number): Observable<boolean> {
    const norm = (correo || '').trim().toLowerCase();
    return this.getUsuarios().pipe(
      map(list => list.some(u => (u.correo || '').trim().toLowerCase() === norm && u.idUsuario !== idActual))
    );
  }
  editarUsuario(id: number, dto: UsuarioEdicionDTO): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/editar/${id}`, dto);
  }
}
