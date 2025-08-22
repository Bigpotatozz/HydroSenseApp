// src/app/services/registrocliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioRegistroDTO {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  edad: number;
  pais: string;
  correo: string;
  contrasenia: string;
  telefono: string;
  nivel: string;
}

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private apiBase = 'https://localhost:7160';

  constructor(private http: HttpClient) { }

  registrar(dto: UsuarioRegistroDTO): Observable<any> {
    return this.http.post(`${this.apiBase}/api/Usuarios/registro`, dto);
  }
}
