
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { HttpClientModule } from '@angular/common/http'; // Para el servicio
import { VentaService } from '../services/ventas.service';
import { UsuarioDTO, ProductoVentaDTO, DetalleVentaForm, VentaDTO } from '../dto/ventas/createVentas.dto';

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

  constructor(private ventaService: VentaService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarProductos();
    this.addDetalleVenta(); // Añade el primer renglón por defecto
    this.setFechaActual();
  }

  setFechaActual(): void {
    const now = new Date();
    // Formato YYYY-MM-DDTHH:mm para datetime-local
    this.fechaVenta = now.toISOString().slice(0, 16);
  }

  cargarUsuarios(): void {
    this.ventaService.getUsuariosNivel2().subscribe({
      next: (res) => {
        if (res.success) {
          this.usuarios = res.data;
        }
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  cargarProductos(): void {
    this.ventaService.getProductosParaVenta().subscribe({
      next: (res) => {
        if (res.success) {
          this.productos = res.data;
        }
      },
      error: (err) => console.error('Error al cargar productos:', err)
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
    this.detallesVenta.splice(index, 1);
  }

  onProductoChange(index: number): void {
    const detalle = this.detallesVenta[index];
    if (detalle.productoSeleccionado) {
      detalle.stockActual = detalle.productoSeleccionado.cantidadDisponible;
      // Resetea la cantidad si excede el nuevo stock
      if (detalle.cantidad && detalle.cantidad > detalle.stockActual) {
        detalle.cantidad = detalle.stockActual;
      }
    } else {
      detalle.stockActual = 0;
    }
  }

  onCantidadChange(index: number): void {
    const detalle = this.detallesVenta[index];
    if (detalle.cantidad !== null && detalle.cantidad < 0) {
      detalle.cantidad = 0; // Prevenir cantidades negativas en el UI
      alert('La cantidad no puede ser negativa.');
    }
    if (detalle.cantidad !== null && detalle.cantidad > detalle.stockActual) {
      alert(`No hay suficiente stock para ${detalle.productoSeleccionado?.nombre || 'este producto'}. Disponible: ${detalle.stockActual}`);
      detalle.cantidad = detalle.stockActual; // Limitar la cantidad al stock disponible
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

    const detallesValidos = this.detallesVenta.filter(d => d.productoSeleccionado && d.cantidad !== null && d.cantidad > 0);

    if (detallesValidos.length === 0) {
      alert('Debe añadir al menos un producto válido a la venta.');
      return;
    }

    // Convertir detalles del formulario a los que espera el backend
    const detallesParaApi = detallesValidos.map(d => {
      const detalle: any = {
        cantidad: d.cantidad!,
        nota: d.nota
      };
      if (d.productoSeleccionado?.tipo === 'sistema') {
        detalle.idSistema = d.productoSeleccionado.id;
      } else if (d.productoSeleccionado?.tipo === 'componente') {
        detalle.idComponente = d.productoSeleccionado.id;
      }
      return detalle;
    });

    const venta: VentaDTO = {
      idCliente: this.clienteSeleccionadoId,
      fechaVenta: this.fechaVenta,
      detalles: detallesParaApi
    };

    this.ventaService.registrarVenta(venta).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Venta registrada exitosamente: ' + res.message);
          // Reiniciar el formulario después de una venta exitosa
          this.clienteSeleccionadoId = null;
          this.detallesVenta = [];
          this.addDetalleVenta();
          this.setFechaActual();
          // Opcional: Recargar productos para reflejar el stock actualizado
          this.cargarProductos();
        } else {
          alert('Error al registrar venta: ' + res.message);
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Ocurrió un error inesperado al registrar la venta.';
        alert(errorMessage);
        console.error('Error en la API de venta:', err);
      }
    });
  }
}
