import { Component, OnInit } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [Toolbar, AvatarModule, ButtonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  
  secciones: any[] = [];
  nombreUsuario: string = "";

  constructor(private router: Router){}

  ngOnInit(){
    let storageUsuario = localStorage.getItem("usuario");
    if(!storageUsuario) return;

    let usuario = JSON.parse(storageUsuario);
    this.nombreUsuario = usuario.nombre;
  }


  cerrarSesion(){

    localStorage.removeItem("usuario");
    this.router.navigate(['/login']);
  }

}
