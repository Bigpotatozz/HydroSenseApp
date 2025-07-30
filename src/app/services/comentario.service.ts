import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Comentario {
  nombreUsuario: string;
  nombreSistema: string;
  comentario: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private url: string = 'https://localhost:7160';

  constructor(private http: HttpClient) { }

  obtenerComentarios() {
    return this.http.get<{ success: boolean, message: string, data: Comentario[] }>(`${this.url}/api/Sistema/comentarios`);
  }
}
