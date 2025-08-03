import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComentarioService } from '../services/comentario.service';
import { Comentario } from '../dto/comentarios/showComentarios.dto';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './comentarios.component.html'
})
export class ComentariosComponent implements OnInit {
  comentarios: Comentario[] = [];
  cargando = true;

  constructor(private comentarioService: ComentarioService) { }

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.cargando = true;
    this.comentarioService.obtenerComentarios().subscribe({
      next: (res) => {
        if (res.success) {
          this.comentarios = res.data;
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando comentarios:', err);
        this.cargando = false;
      }
    });
  }

  trackByComentario(index: number, comentario: Comentario): number {
    return comentario.idComentario;
  }
}
