import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Toolbar } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { InicioComponent } from './inicio/inicio.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { PreguntasComponent } from './preguntas/preguntas.component';
import { ProductosComponent } from './productos/productos.component';
import { ContactoComponent } from './contacto/contacto.component';
import { OpinionComponent } from './opinion/opinion.component';
import { CotizacionComponent } from './cotizacion/cotizacion.component';
import { ComentarioService } from '../services/comentario.service';
import { Comentario } from '../models/comentario.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-landing',
  imports: [
    Toolbar,
    AvatarModule,
    ButtonModule,
    RouterModule,
    InicioComponent,
    NosotrosComponent,
    PreguntasComponent,
    ProductosComponent,
    ContactoComponent,
    OpinionComponent,
    CotizacionComponent,
    NgFor,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  comentarios: Comentario[] = [];

  comentariosMostrar: Comentario[] = [];
  constructor(private comentarioService: ComentarioService) {}

  ngOnInit() {
    this.comentarioService.obtenerComentarios().subscribe({
      next: (data) => {
        this.comentarios = data.data;

        this.comentariosMostrar = this.comentarios.slice(0, 3);
      },
      error: (error) => {
        console.error('Error al obtener comentarios:', error);
      },
    });
  }
}
