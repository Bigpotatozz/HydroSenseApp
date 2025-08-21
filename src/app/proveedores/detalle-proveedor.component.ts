import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-detalle-proveedor',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './detalle-proveedor.component.html',
  styleUrls: ['./detalle-proveedor.component.css']
})
export class DetalleProveedorComponent implements OnInit {
  proveedor: string = '';
  contacto: string = '';
  componentes: any[] = [];
  mostrarFormulario: { [idComponente: number]: boolean } = {};
  cantidades: { [idComponente: number]: number } = {};
  precios: { [idComponente: number]: number } = {};

  telefono: string = '';
  correo: string = '';
  calle: string = '';
  numero: string = '';
  colonia: string = '';
  ciudad: string = '';
  estado: string = '';
  codigoPostal: string = '';
  pais: string = '';

  token: any = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    const proveedorParam = this.route.snapshot.queryParamMap.get('proveedor');
    const contactoParam = this.route.snapshot.queryParamMap.get('contacto');
    const idProveedor = this.route.snapshot.queryParamMap.get('id');

    if (!idProveedor) return;

    this.proveedor = proveedorParam || '';
    this.contacto = contactoParam || '';

    const stored = localStorage.getItem('proveedorSeleccionado');
    if (stored) {
      try {
        const prov = JSON.parse(stored);
        this.telefono = prov?.telefono || '';
        this.correo = prov?.correo || '';
        this.calle = prov?.calle || '';
        this.numero = prov?.numero || '';
        this.colonia = prov?.colonia || '';
        this.ciudad = prov?.ciudad || '';
        this.estado = prov?.estado || '';
        this.codigoPostal = prov?.codigoPostal || '';
        this.pais = prov?.pais || '';
      } catch { /* noop */ }
    }

    this.token = this.authService.getCurrentUserToken();

    this.http.get<any>(
      `https://localhost:7160/api/Proveedor/componentes-por-proveedor`,
      { headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}`, 'idProveedor': idProveedor }) }
    ).subscribe({
      next: (res) => {
        this.componentes = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  get direccionCompleta(): string {
    const parts = [
      this.calle,
      this.numero,
      this.colonia,
      this.ciudad,
      this.estado,
      this.codigoPostal,
      this.pais
    ].map(v => (v ?? '').toString().trim()).filter(v => v.length > 0);

    return parts.length > 0 ? parts.join(', ') : '—';
  }

  toggleFormulario(id: number): void {
    this.mostrarFormulario[id] = !this.mostrarFormulario[id];
    this.cantidades[id] = 0;
    this.precios[id] = 0;
  }

  actualizarInventario(id: number): void {
    const body = {
      idComponente: id,
      cantidadAdquirida: this.cantidades[id],
      precioAdquisicion: this.precios[id]
    };

    this.http.put<any>('https://localhost:7160/api/Proveedor/actualizar-inventario',
      body, { headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }) })
      .subscribe({
        next: (res) => {
          if (res.success) {
            const index = this.componentes.findIndex(c => c.idComponente === id);
            if (index !== -1) {
              this.componentes[index].cantidad = res.data.cantidad;
              this.componentes[index].precio = res.data.precio;
            }
            this.mostrarFormulario[id] = false;
          }
        }
      });
  }
}
