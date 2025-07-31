import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDto } from '../dto/usuarios/login.dto';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string =  'https://localhost:7160';

  constructor(private httpClient: HttpClient) { }


  login(loginDto: LoginDto){
    return this.httpClient.post(`${this.url}/api/Usuarios/login`, loginDto);
  }

}
