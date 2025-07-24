import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Usuario } from '../models/usuario.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-usuarios',
  imports: [HttpClientModule, TableModule, CommonModule, ButtonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor( private usuariosService: UsuariosService){}

  ngOnInit(): void {
    this.obtenerUsuarios();
      
  }


  obtenerUsuarios(){
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        console.log(data);
        this.usuarios = data as Usuario[];
      },
      error: (error) => {
        console.error('Error fetching usuarios:', error);
      }
    });
  }

}
