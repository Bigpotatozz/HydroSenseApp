import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { LandingService, ApiResponse, ProductoDisponible } from '../../services/landing.service';

type Tipo = 'sistema' | 'componente';

interface Producto {
  id: number;
  nombre: string;
  tipo: Tipo;
  precio: number;
}

@Component({
  selector: 'app-cotizacion',
  standalone: true,
  imports: [FormsModule, CommonModule, CurrencyPipe],
  templateUrl: './cotizacion.component.html',
  styleUrl: './cotizacion.component.css'
})
export class CotizacionComponent implements OnInit {
  email = '';
  nombre = '';
  descripcion = '';

  productos: Producto[] = [];
  seleccionados: Producto[] = [];
  seleccionActual = '';

  loading = false;
  errorMsg: string | null = null;

  constructor(private landingService: LandingService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.loading = true;
    this.errorMsg = null;

    this.landingService.getProductosCotizacion().subscribe({
      next: (resp: ApiResponse<ProductoDisponible[]>) => {
        this.loading = false;
        if (resp?.success && Array.isArray(resp.data)) {
          this.productos = resp.data as Producto[];
        } else {
          this.productos = [];
          this.errorMsg = 'No se pudieron cargar los productos.';
        }
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 401 || err?.status === 403) {
          this.errorMsg = 'Debes iniciar sesión para ver los productos.';
        } else if (err?.status === 404) {
          this.errorMsg = 'Ruta de productos no encontrada en el servidor.';
        } else {
          this.errorMsg = 'Error al cargar los productos.';
        }
        this.productos = [];
      }
    });
  }

  estaSeleccionado(p: Producto): boolean {
    return this.seleccionados.some(s => s.id === p.id && s.tipo === p.tipo);
  }

  onSeleccionProducto(value: string) {
    if (!value) return;
    const [tipo, idStr] = value.split('|');
    const id = Number(idStr) || 0;

    const found = this.productos.find(p => p.id === id && p.tipo === (tipo as Tipo));
    if (!found || this.estaSeleccionado(found)) {
      this.seleccionActual = '';
      return;
    }

    this.seleccionados.push(found);
    this.seleccionActual = '';
  }

  quitarProducto(p: Producto) {
    this.seleccionados = this.seleccionados.filter(x => !(x.id === p.id && x.tipo === p.tipo));
  }

  onSubmit() {
    const productosBody = this.seleccionados.map(p =>
      p.tipo === 'sistema' ? { idSistema: p.id } : { idComponente: p.id }
    );

    const body = {
      nombreContacto: this.nombre,
      correoElectronico: this.email,
      situacionDetallada: this.descripcion,
      productos: productosBody
    };

    this.landingService.postCotizacion(body).subscribe({
      next: () => {
        alert('Solicitud de cotización enviada correctamente');
        this.nombre = '';
        this.email = '';
        this.descripcion = '';
        this.seleccionados = [];
        this.seleccionActual = '';
      },
      error: () => {
        alert('No se pudo enviar la cotización.');
      }
    });
  }
}
