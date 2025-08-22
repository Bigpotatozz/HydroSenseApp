import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProduccionService } from '../services/produccion.service';
import { SistemaProduccionDTO, ApiResponse } from '../dto/produccion/showSistemasProduccion.dto';
import { Router } from '@angular/router';

type Tipo = 'sistema' | 'componente';

interface ComponenteDisponible {
  id: number;
  nombre: string;
  tipo: Tipo;
  precio: number;
}

interface ComponenteCantidad {
  idComponente: number;
  cantidadRequerida: number;
  nombre?: string;
}

@Component({
  selector: 'app-produccion',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.css']
})
export class ProduccionComponent implements OnInit {
  sistemas: SistemaProduccionDTO[] = [];
  imagenSistema: string = 'assets/foto.jpg';

  showCrear = false;

  nuevoNombreSistema = '';
  nuevoDescripcion = '';
  nuevoFabricante = '';
  nuevoUrlImagen = '';
  nuevoCantidad: number = 0;

  componentesDisponibles: ComponenteDisponible[] = [];
  selComponenteId = '';
  selCantidad = 1;
  componentesSeleccionados: ComponenteCantidad[] = [];

  creando = false;
  errorMsg: string | null = null;

  constructor(
    private produccionService: ProduccionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarSistemas();
  }

  cargarSistemas(): void {
    this.produccionService.obtenerSistemasProduccion().subscribe({
      next: (res: ApiResponse<SistemaProduccionDTO[]>) => {
        if (res.success) this.sistemas = res.data;
      }
    });
  }

  producir(idSistema: number): void {
    this.produccionService.producirSistema(idSistema).subscribe({
      next: (res: ApiResponse<any>) => {
        if (res.success) {
          alert(res.message);
          this.cargarSistemas();
        } else {
          alert(res.message || 'Error al producir.');
        }
      },
      error: (err) => alert(err?.error?.message || 'Error al producir.')
    });
  }

  solicitarPiezas(): void {
    this.router.navigate(['/home/proveedores']);
  }

  canProduce(sistema: SistemaProduccionDTO): boolean {
    return sistema.componentes.every(c => c.cantidadDisponible >= c.cantidadRequerida);
  }

  needsPieces(sistema: SistemaProduccionDTO): boolean {
    return sistema.componentes.some(c => c.cantidadDisponible < c.cantidadRequerida);
  }

  abrirCrear(): void {
    this.resetCrear();
    this.showCrear = true;
    this.cargarComponentes();
  }

  cerrarCrear(): void {
    this.showCrear = false;
  }

  cargarComponentes(): void {
    this.errorMsg = null;
    this.produccionService.obtenerComponentesParaConstruccion().subscribe({
      next: (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.componentesDisponibles = resp.data.filter(p => p.tipo === 'componente');
        } else {
          this.componentesDisponibles = [];
          this.errorMsg = 'No se pudieron cargar los componentes.';
        }
      },
      error: () => {
        this.componentesDisponibles = [];
        this.errorMsg = 'Error al cargar componentes.';
      }
    });
  }

  agregarComponente(): void {
    if (!this.selComponenteId) return;
    const id = Number(this.selComponenteId);
    if (!id || this.selCantidad <= 0) return;
    const found = this.componentesDisponibles.find(c => c.id === id && c.tipo === 'componente');
    if (!found) return;
    const ya = this.componentesSeleccionados.some(x => x.idComponente === id);
    if (ya) {
      this.componentesSeleccionados = this.componentesSeleccionados.map(x =>
        x.idComponente === id ? { ...x, cantidadRequerida: x.cantidadRequerida + this.selCantidad } : x
      );
    } else {
      this.componentesSeleccionados.push({
        idComponente: id,
        cantidadRequerida: this.selCantidad,
        nombre: found.nombre
      });
    }
    this.selComponenteId = '';
    this.selCantidad = 1;
  }

  quitarComponente(idComponente: number): void {
    this.componentesSeleccionados = this.componentesSeleccionados.filter(x => x.idComponente !== idComponente);
  }

  guardarSistema(): void {
    if (!this.nuevoNombreSistema.trim() || !this.nuevoFabricante.trim() || !this.nuevoUrlImagen.trim()) {
      alert('Nombre del sistema, fabricante y URL de imagen son obligatorios.');
      return;
    }
    if (this.componentesSeleccionados.length === 0) {
      alert('Agrega al menos un componente.');
      return;
    }
    const dto = {
      nombreSistema: this.nuevoNombreSistema.trim(),
      descripcion: this.nuevoDescripcion.trim(),
      nombreFabricante: this.nuevoFabricante.trim(),
      urlImagen: this.nuevoUrlImagen.trim(),
      cantidad: this.nuevoCantidad || 0,
      componentes: this.componentesSeleccionados.map(c => ({
        idComponente: c.idComponente,
        cantidadRequerida: c.cantidadRequerida
      }))
    };
    this.creando = true;
    this.produccionService.crearSistema(dto).subscribe({
      next: (res: ApiResponse<any>) => {
        this.creando = false;
        if (res.success) {
          this.showCrear = false;
          this.cargarSistemas();
          alert('Sistema creado correctamente.');
        } else {
          alert(res.message || 'No fue posible crear el sistema.');
        }
      },
      error: (err) => {
        this.creando = false;
        alert(err?.error?.message || 'Error al crear el sistema.');
      }
    });
  }

  private resetCrear(): void {
    this.nuevoNombreSistema = '';
    this.nuevoDescripcion = '';
    this.nuevoFabricante = '';
    this.nuevoUrlImagen = '';
    this.nuevoCantidad = 0;
    this.selComponenteId = '';
    this.selCantidad = 1;
    this.componentesSeleccionados = [];
    this.errorMsg = null;
  }
}
