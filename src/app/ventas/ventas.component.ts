import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VentaService } from '../services/ventas.service'; // Corregido el nombre del servicio
import { UsuarioDTO, ProductoVentaDTO, DetalleVentaForm, VentaDTO } from '../dto/ventas/createVentas.dto'; // Corregida la ruta del DTO
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ventas.component.html', 
  styleUrls: ['./ventas.component.css'] 
})
export class VentaComponent implements OnInit {
  usuarios: UsuarioDTO[] = [];
  productos: ProductoVentaDTO[] = [];

  clienteSeleccionadoId: number | null = null;
  fechaVenta: string = '';
  detallesVenta: DetalleVentaForm[] = [];
  idVendedor: number | null = null;

  constructor(private ventaService: VentaService, private authService: AuthService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarProductos();
    this.addDetalleVenta();
    this.setFechaActual();
    this.idVendedor = this.authService.getLoggedInUserId();
    if (!this.idVendedor) {
      alert('No se pudo identificar al vendedor. Por favor, inicie sesión.');
    }
  }

  setFechaActual(): void {
    const now = new Date();
    this.fechaVenta = now.toISOString().slice(0, 16);
  }

  cargarUsuarios(): void {
    this.ventaService.getUsuariosNivel2().subscribe({
      next: (res) => {
        if (res.success) {
          this.usuarios = res.data;
        }
      },
      error: (err) => alert('Error al cargar clientes: ' + (err.error?.message || err.message))
    });
  }

  cargarProductos(): void {
    this.ventaService.getProductosParaVenta().subscribe({
      next: (res) => {
        if (res.success) {
          this.productos = res.data;
        }
      },
      error: (err) => alert('Error al cargar productos: ' + (err.error?.message || err.message))
    });
  }

  addDetalleVenta(): void {
    this.detallesVenta.push({
      productoSeleccionado: null,
      cantidad: null,
      nota: '',
      stockActual: 0
    });
  }

  removeDetalleVenta(index: number): void {
    if (this.detallesVenta.length > 1) {
      this.detallesVenta.splice(index, 1);
    }
  }

  onProductoChange(index: number): void {
    const detalle = this.detallesVenta[index];
    if (detalle.productoSeleccionado) {
      detalle.stockActual = detalle.productoSeleccionado.cantidadDisponible;
      if (detalle.cantidad && detalle.cantidad > detalle.stockActual) {
        detalle.cantidad = detalle.stockActual;
      }
    } else {
      detalle.stockActual = 0;
      detalle.cantidad = null;
    }
  }

  onCantidadChange(index: number): void {
    const detalle = this.detallesVenta[index];
    if (detalle.cantidad === null) {
      return;
    }

    if (detalle.cantidad < 0) {
      detalle.cantidad = 0;
      alert('La cantidad no puede ser negativa.');
      return;
    }

    if (detalle.productoSeleccionado && detalle.cantidad > detalle.stockActual) {
      alert(`No hay suficiente stock para ${detalle.productoSeleccionado.nombre}. Disponible: ${detalle.stockActual}`);
      detalle.cantidad = detalle.stockActual;
    }
  }

  registrarVenta(): void {
    if (!this.clienteSeleccionadoId) {
      alert('Debe seleccionar un cliente.');
      return;
    }
    if (!this.fechaVenta) {
      alert('Debe seleccionar una fecha y hora.');
      return;
    }
    if (!this.idVendedor) {
      alert('Error: No se ha podido identificar al vendedor. Por favor, intente iniciar sesión de nuevo.');
      return;
    }

    const detallesValidos = this.detallesVenta.filter(d =>
      d.productoSeleccionado && d.cantidad !== null && d.cantidad > 0
    );

    if (detallesValidos.length === 0) {
      alert('Debe añadir al menos un producto válido a la venta.');
      return;
    }

    const detallesParaApi = detallesValidos.map(d => {
      const detalle: any = {
        cantidad: d.cantidad!,
        nota: d.nota || null
      };
      if (d.productoSeleccionado?.tipo === 'sistema') {
        detalle.idSistema = d.productoSeleccionado.id;
        detalle.idComponente = null;
      } else if (d.productoSeleccionado?.tipo === 'componente') {
        detalle.idComponente = d.productoSeleccionado.id;
        detalle.idSistema = null;
      }
      return detalle;
    });

    const apiPayload = {
      idCliente: this.clienteSeleccionadoId,
      fechaVenta: this.fechaVenta,
      idVendedor: this.idVendedor,
      detalles: detallesParaApi
    };

    this.ventaService.registrarVenta(apiPayload).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Venta registrada exitosamente: ' + res.message);
          this.resetForm();
          this.cargarProductos();
        } else {
          alert('Error al registrar venta: ' + res.message);
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Ocurrió un error inesperado al registrar la venta.';
        alert(errorMessage);
      }
    });
  }

  resetForm(): void {
    this.clienteSeleccionadoId = null;
    this.detallesVenta = [];
    this.addDetalleVenta();
    this.setFechaActual();
  }
}
