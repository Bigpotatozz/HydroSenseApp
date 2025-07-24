import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { EditarUsuarioDto } from '../dto/usuarios/editarUsuario.dto';
import { RegistrarUsuarioDto } from '../dto/usuarios/registrarUsuario.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url: string =  'https://localhost:7160';

  constructor(private httpClient: HttpClient) { }

  getUsuarios(){
    return this.httpClient.get(`${this.url}/api/Usuarios/getUsuarios`);
  }

  editUsarios(usuario: EditarUsuarioDto, id: number){

    console.log(usuario)
    return this.httpClient.put(`${this.url}/api/Usuarios/editar/${id}`, usuario);
  }


  deleteUsuario(id: number){
    return this.httpClient.delete(`${this.url}/api/Usuarios/eliminar/${id}`);
  }

  registerUsuario(usuario: RegistrarUsuarioDto){
    return this.httpClient.post(`${this.url}/api/Usuarios/registro`, usuario);
  }
}
