import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComentarioService, Comentario } from '../services/comentario.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="p-6 space-y-4">
      <div *ngFor="let comentario of comentarios" class="bg-white rounded-xl shadow p-4">
        <p class="text-sm text-gray-600">{{ comentario.nombreUsuario }} comentó</p>
        <p class="mt-2 text-gray-800">{{ comentario.comentario }}</p>
        <textarea [(ngModel)]="respuestas[comentario.nombreUsuario]" class="w-full mt-4 p-2 border rounded" rows="2" placeholder="Escribe una respuesta..."></textarea>
      </div>
    </div>
  `
})
export  class ComentariosComponent implements OnInit {
  comentarios: Comentario[] = [];
  respuestas: { [usuario: string]: string } = {};

  constructor(private comentarioService: ComentarioService) {}

  ngOnInit(): void {
    this.comentarioService.obtenerComentarios().subscribe(res => {
      if (res.success) {
        this.comentarios = res.data;
      }
    });
  }
}
