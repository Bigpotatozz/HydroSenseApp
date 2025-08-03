import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario, ResponderComentarioDTO } from '../dto/comentarios/showComentarios.dto';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private url: string = 'https://localhost:7160';

  constructor(private http: HttpClient) { }

  obtenerComentarios(): Observable<{ success: boolean, message: string, data: Comentario[] }> {
    return this.http.get<{ success: boolean, message: string, data: Comentario[] }>(`${this.url}/api/Sistema/comentarios`);
  }


}
