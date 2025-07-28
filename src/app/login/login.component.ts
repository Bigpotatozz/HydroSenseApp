import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginDto } from '../dto/usuarios/login.dto';
import { LoginService } from '../services/login.service';
import { LoginResponse } from '../dto/usuarios/loginResponse.dto';
import { Router } from '@angular/router';

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


  constructor(private loginService: LoginService, private router: Router){}


  login(){

    let loginDto = new LoginDto(this.email, this.password);

    this.loginService.login(loginDto).subscribe({
      next: (data: any) => {
        this.token = data.data.token;
        localStorage.setItem("usuario", JSON.stringify(data.data));
        console.log(data);

        if(data.data.nivel == "1" ){
          this.router.navigate(['/home']);
        }else{
          this.router.navigate(['/panelClientes']);
        }
        
      },
      error: (error) => {
        console.error(error)
        alert("Correo o contraseña incorrectos")
      }
    });


  }
}
