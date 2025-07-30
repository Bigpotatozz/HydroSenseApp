import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProduccionService } from '../services/produccion.service';
import { SistemaProduccionDTO, ApiResponse } from '../dto/produccion/showSistemasProduccion.dto';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-produccion',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.css']
})
export class ProduccionComponent implements OnInit {
  sistemas: SistemaProduccionDTO[] = [];
  imagenSistema: string = 'assets/foto.jpg';

  constructor(
    private produccionService: ProduccionService,
    private router: Router // Inyecta Router
  ) { }

  ngOnInit(): void {
    this.cargarSistemas();
  }

  cargarSistemas(): void {
    this.produccionService.obtenerSistemasProduccion().subscribe({
      next: (res: ApiResponse<SistemaProduccionDTO[]>) => {
        if (res.success) {
          this.sistemas = res.data;
        }
      },
      error: (err) => console.error('Error al obtener sistemas de producción', err)
    });
  }

  producir(idSistema: number): void {
    this.produccionService.producirSistema(idSistema).subscribe({
      next: (res: ApiResponse<any>) => {
        if (res.success) {
          alert(res.message);
          this.cargarSistemas(); // Vuelve a cargar los sistemas para actualizar la pantalla
        } else {
          alert(`Error: ${res.message}`);
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Ocurrió un error inesperado al producir.';
        alert(errorMessage);
        console.error('Error en la producción:', err);
      }
    });
  }

  solicitarPiezas(): void {
    this.router.navigate(['/home/proveedores']); // Navega a la ruta de proveedores
  }

  // Método para verificar si se puede producir (todos los componentes tienen suficiente inventario)
  canProduce(sistema: SistemaProduccionDTO): boolean {
    return sistema.componentes.every(c => c.cantidadDisponible >= c.cantidadRequerida);
  }

  // Método para verificar si se necesitan piezas (algún componente no tiene suficiente inventario)
  needsPieces(sistema: SistemaProduccionDTO): boolean {
    return sistema.componentes.some(c => c.cantidadDisponible < c.cantidadRequerida);
  }
}
