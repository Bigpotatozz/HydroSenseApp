import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CotizacionService } from '../services/cotizacion.service';
import { CotizacionResumenDTO } from '../dto/cotizaciones/showCotizacion.dto';

@Component({
  selector: 'app-cotizaciones',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {
  cotizaciones: CotizacionResumenDTO[] = [];

  constructor(private cotizacionService: CotizacionService) { }

  ngOnInit(): void {
    this.cotizacionService.obtenerCotizaciones().subscribe({
      next: (res) => {
        if (res.success) {
          this.cotizaciones = res.data;
        }
      },
      error: (err) => console.error('Error al obtener cotizaciones', err)
    });
  }
}
