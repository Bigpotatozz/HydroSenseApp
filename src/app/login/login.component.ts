import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginDto } from '../dto/usuarios/login.dto';
import { LoginService } from '../services/login.service';
import { LoginResponse } from '../dto/usuarios/loginResponse.dto';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  token: string = "";


  constructor(private loginService: LoginService){}


  login(){

    let loginDto = new LoginDto(this.email, this.password);

    this.loginService.login(loginDto).subscribe({
      next: (data: any) => {
        
        this.token = data.data.token;
        console.log(this.token);
      },
      error: (error) => {
        console.error(error)
      }
    });


  }
}
