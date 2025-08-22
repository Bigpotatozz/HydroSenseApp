import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HistorialComprasService, ComprasClienteResponse, VentaClienteDto } from '../services/historial-compras.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-historial-compras',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './historial-compras.component.html',
  styleUrls: ['./historial-compras.component.css']
})
export class HistorialComprasComponent implements OnInit, OnDestroy {
  // estado
  loading = signal<boolean>(true);
  errorMsg = signal<string | null>(null);
  data = signal<ComprasClienteResponse | null>(null);

  // UI: venta expandida por id
  expandedVentaId = signal<number | null>(null);

  private sub?: Subscription;

  // derivados
  clienteNombre = computed(() => this.data()?.cliente?.nombreCompleto ?? '');
  ventas = computed<VentaClienteDto[]>(() => this.data()?.ventas ?? []);

  constructor(
    private historialService: HistorialComprasService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const initialUserId = this.authService.getLoggedInUserId();
    if (initialUserId) {
      this.cargarHistorial(initialUserId);
    } else {
      this.loading.set(false);
      this.errorMsg.set('No hay usuario logueado.');
    }

    // si cambia el usuario logueado, refrescar
    this.sub = this.authService.currentUser.subscribe(user => {
      const id = user?.idUsuario;
      if (id) {
        this.cargarHistorial(id);
      } else {
        this.data.set(null);
        this.errorMsg.set('No hay usuario logueado.');
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  cargarHistorial(idUsuario: number): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.historialService.getComprasCliente(idUsuario).subscribe({
      next: (resp) => {
        this.loading.set(false);
        if (resp.success) {
          this.data.set(resp.data);
          const first = resp.data.ventas?.[0];
          this.expandedVentaId.set(first ? first.idVenta : null);
        } else {
          this.data.set(null);
          this.errorMsg.set(resp.message || 'No fue posible cargar el historial.');
        }
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        this.data.set(null);
        this.errorMsg.set('Error al cargar historial de compras.');
      }
    });
  }

  toggleVenta(idVenta: number): void {
    this.expandedVentaId.set(this.expandedVentaId() === idVenta ? null : idVenta);
  }

  trackByVenta = (_: number, v: VentaClienteDto) => v.idVenta;
  trackByIndex = (_: number, __: unknown) => _;
}
