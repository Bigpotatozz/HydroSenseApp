
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginDto } from '../dto/usuarios/login.dto';
import { LoginService } from '../services/login.service';
import { LoginResponse } from '../dto/usuarios/loginResponse.dto';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

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

  constructor(
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService 
  ) { }

  login() {
    let loginDto = new LoginDto(this.email, this.password);

    this.loginService.login(loginDto).subscribe({
      next: (data: any) => {
        this.token = data.data.token;

        const decodedToken = this.decodeJwt(this.token);
        const idUsuario = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        const nivel = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        const userDataToStore = {
          idUsuario: parseInt(idUsuario, 10), 
          nombre: data.data.nombre,
          apellidoPaterno: data.data.apellidoPaterno,
          apellidoMaterno: data.data.apellidoMaterno,
          correo: data.data.correo,
          nivel: nivel,
          token: this.token 
        };

        this.authService.login(userDataToStore);

        console.log("Datos guardados en localStorage:", userDataToStore);

        if (nivel === "1") {
          this.router.navigate(['/home']);
        } else if (nivel === "2") {
          this.router.navigate(['/panelClientes']);
        } else {
          alert("Nivel de usuario no reconocido. Redirigiendo al login.");
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error(error);
        alert("Correo o contraseña incorrectos");
      }
    });
  }

  private decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error decodificando JWT:", e);
      return {};
    }
  }
}
