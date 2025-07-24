import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Usuario } from '../models/usuario.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { EditarUsuarioDto } from '../dto/usuarios/editarUsuario.dto';
import { FormsModule } from '@angular/forms';
import { RegistrarUsuarioDto } from '../dto/usuarios/registrarUsuario.dto';

@Component({
  selector: 'app-usuarios',
  imports: [HttpClientModule, TableModule, CommonModule, ButtonModule, InputTextModule, Dialog, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];

  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  edad: number = 0;
  pais: string = '';
  correo: string = '';
  telefono: string = '';
  contrasenia: string = '';
  id: number = 0;
  nivel: string = '';

  constructor( private usuariosService: UsuariosService){}

  ngOnInit(): void {
    this.obtenerUsuarios();
      
  }

  

  visible: boolean = false;
  visible2: boolean = false;

  clearProperties(){  
      this.nombre = '';
      this.apellidoPaterno = '';
      this.apellidoMaterno = '';
      this.edad = 0;
      this.pais = '';
      this.correo = '';
      this.telefono = '';
      this.contrasenia = '';
      this.id = 0;
    }
 
  showDialog(usuario: Usuario) {
      this.nombre = usuario.nombre;
      this.apellidoPaterno = usuario.apellidoPaterno;
      this.apellidoMaterno = usuario.apellidoMaterno;
      this.edad = usuario.edad;
      this.pais = usuario.pais;
      this.correo = usuario.correo;
      this.telefono = usuario.telefono;
      this.id = usuario.idUsuario;

      this.visible = true;
  }

  showDialog2() {
      this.visible2 = true;

      this.clearProperties();
  }


  editarUsuario() {
 
  if (!this.contrasenia || this.contrasenia.trim() === '') {
    alert('La contraseña no puede ser nula o vacía');
    return;
  }

  const editedUser = new EditarUsuarioDto(
    this.nombre,
    this.apellidoPaterno,
    this.apellidoMaterno,
    this.edad,
    this.pais,
    this.correo,
    this.contrasenia,
    this.telefono
  );

  console.log('DTO creado:', editedUser);

  this.usuariosService.editUsarios(editedUser, this.id).subscribe({
    next: (data) => {
      console.log('Usuario editado:', data);
      this.obtenerUsuarios();
      this.clearProperties();
      this.visible = false;
    },
    error: (error) => {
      console.error('Error editing usuario:', error);
    }
  });
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

  eliminarUsuario(id: number) {

    console.log(typeof id);
    this.usuariosService.deleteUsuario(id).subscribe({
      next: (data) => {
        console.log('Usuario eliminado:', data);
        this.obtenerUsuarios();
      },
      error: (error) => {
        console.error('Error deleting usuario:', error);
      }
    });
  }

  agregarUsuario(){
    const newUser = new RegistrarUsuarioDto(
    this.nombre,
    this.apellidoPaterno,
    this.apellidoMaterno,
    this.edad,
    this.pais,
    this.correo,
    this.contrasenia,
    this.telefono,
    this.nivel);

    this.usuariosService.registerUsuario(newUser).subscribe({
      next: (data) => {
        console.log('Usuario registrado:', data);
        this.obtenerUsuarios();
        this.clearProperties();
        this.visible2 = false;
      },
      error: (error) => {
        console.error('Error registering usuario:', error);
      }
    })



  }

}
