import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url: string =  'https://localhost:7160';

  constructor(private httpClient: HttpClient) { }

  getUsuarios(){
    return this.httpClient.get(`${this.url}/api/Usuarios/getUsuarios`);
  }
  
}
