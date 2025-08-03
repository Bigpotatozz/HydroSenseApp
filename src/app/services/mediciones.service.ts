import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MedicionDTO {
  nombreSistema: string;
  nombreFuente: string;
  ph: number | null;
  turbidez: number | null;
  temperatura: number | null;
}

interface ReviewDTO {
  idUsuario: number;
  comentarioTexto: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class MedicionesService {
  private apiUrl = 'https://localhost:7160/api/Mediciones';
  private apiComentariosUrl = 'https://localhost:7160/api/Sistema';

  constructor(private http: HttpClient) { }

  getMedicionesPorUsuario(idUsuario: number): Observable<ApiResponse<{ sensores: MedicionDTO[] }>> {
    return this.http.get<ApiResponse<{ sensores: MedicionDTO[] }>>(
      `${this.apiUrl}/usuario/${idUsuario}`
    );
  }

  getSensores(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/sensores`);
  }

  enviarComentario(review: ReviewDTO): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiComentariosUrl}/agregar-comentario`, review);
  }
}
