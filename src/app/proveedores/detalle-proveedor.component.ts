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

  constructor(private http: HttpClient, private route: ActivatedRoute, private authService: AuthService) { }

  token:any='';
  ngOnInit(): void {
    const proveedorParam = this.route.snapshot.queryParamMap.get('proveedor');
    const contactoParam = this.route.snapshot.queryParamMap.get('contacto');
    const idProveedor = this.route.snapshot.queryParamMap.get('id');
    console.log(idProveedor)

    if (!idProveedor) return;

    this.proveedor = proveedorParam || '';
    this.contacto = contactoParam || '';

   this.token = this.authService.getCurrentUserToken();

    this.http.get<any>(
      `https://localhost:7160/api/Proveedor/componentes-por-proveedor`,
      { headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}`, 'idProveedor': idProveedor }) }
    ).subscribe({
      next: (res) => {
        console.log(res)
        this.componentes = res.data;
      },
      error: (err) => {
        console.log(err)
      }
    });
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
      body, { headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}`}) })
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
