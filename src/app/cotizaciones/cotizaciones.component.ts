// src/app/cotizaciones/cotizaciones.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CotizacionService } from '../services/cotizacion.service';
import { CotizacionResumenDTO } from '../dto/cotizaciones/showCotizacion.dto';

@Component({
  selector: 'app-cotizaciones',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, CurrencyPipe],
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {
  cotizaciones: CotizacionResumenDTO[] = [];
  modalAbierto = false;
  seleccionada?: CotizacionResumenDTO;
  mensaje = '';
  enviando = false;
  eliminando = false;

  constructor(private cotizacionService: CotizacionService) { }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cotizacionService.obtenerCotizaciones().subscribe({
      next: (res) => { if (res.success) this.cotizaciones = res.data; },
      error: (err: HttpErrorResponse) => console.error('Error al obtener cotizaciones', err)
    });
  }

  puedeActuar(c: CotizacionResumenDTO): boolean { return c.estatus === 1; }

  abrirModal(c: CotizacionResumenDTO): void {
    if (!this.puedeActuar(c)) return;
    this.seleccionada = c;
    this.mensaje = '';
    this.modalAbierto = true;
  }

  cerrarModal(): void { this.modalAbierto = false; }

  enviarRespuesta(): void {
    if (!this.seleccionada || !this.mensaje.trim()) return;
    this.enviando = true;
    this.cotizacionService
      .responder(this.seleccionada.idCotizacion, { Mensaje: this.mensaje.trim() })
      .subscribe({
        next: () => {
          this.seleccionada!.estatus = 2;
          this.enviando = false;
          this.modalAbierto = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Detalle backend:', err.error);
          this.enviando = false;
        }
      });
  }

  eliminar(c: CotizacionResumenDTO): void {
    if (!this.puedeActuar(c)) return;
    this.eliminando = true;
    this.cotizacionService.eliminar(c.idCotizacion).subscribe({
      next: () => { c.estatus = 3; this.eliminando = false; },
      error: (err: HttpErrorResponse) => {
        console.error('Error al eliminar cotización', err);
        this.eliminando = false;
      }
    });
  }

  claseTarjeta(c: CotizacionResumenDTO) {
    return {
      'bg-white': c.estatus === 1,
      'bg-green-50': c.estatus === 2,
      'bg-red-50': c.estatus === 3,
      'rounded-lg': true,
      'shadow-md': true,
      'p-6': true,
      'relative': true
    };
  }
}
