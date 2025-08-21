import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../services/proveedor.service';
import { HttpClientModule } from '@angular/common/http';
import { ComponenteRegistroDTO, ProveedorRegistrarDTO } from '../dto/proveedores/createProveedores.dto';

@Component({
  selector: 'app-registro-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './registro-proveedor.component.html',
  styleUrls: ['./registro-proveedor.component.css']
})
export class RegistroProveedorComponent implements OnInit {

  // Campos del proveedor
  nombreProveedor: string = '';
  nombreContacto: string = '';

  // Contacto
  telefono: string = '';
  correo: string = '';

  // Dirección
  calle: string = '';
  numero: string = '';
  colonia: string = '';
  ciudad: string = '';
  estado: string = '';
  codigoPostal: string = '';
  pais: string = '';

  // Componentes asociados opcionales
  componentes: ComponenteRegistroDTO[] = [];

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.agregarComponente();
  }

  agregarComponente(): void {
    this.componentes.push({
      nombreComponente: '',
      descripcion: '',
      precio: 0,
      cantidad: 0
    });
  }

  eliminarComponente(i: number): void {
    if (this.componentes.length > 1) {
      this.componentes.splice(i, 1);
    }
  }

  registrarProveedor(): void {
    const dto: ProveedorRegistrarDTO = {
      idProveedor: 0,
      nombreProveedor: this.nombreProveedor,
      nombreContacto: this.nombreContacto,

      telefono: this.telefono || undefined,
      correo: this.correo || undefined,

      calle: this.calle || undefined,
      numero: this.numero || undefined,
      colonia: this.colonia || undefined,
      ciudad: this.ciudad || undefined,
      estado: this.estado || undefined,
      codigoPostal: this.codigoPostal || undefined,
      pais: this.pais || undefined,

      componentes: this.componentes
        .filter(c => c.nombreComponente && c.cantidad > 0 && c.precio >= 0.01)
        .map(c => ({
          nombreComponente: c.nombreComponente.trim(),
          descripcion: c.descripcion?.trim() || '',
          precio: Number(c.precio),
          cantidad: Number(c.cantidad)
        }))
    };

    if (!dto.nombreProveedor?.trim() || !dto.nombreContacto?.trim()) {
      alert('Nombre del proveedor y nombre del contacto son obligatorios.');
      return;
    }

    this.proveedorService.registrarProveedorConComponentes(dto).subscribe({
      next: (res) => {
        if (res.success) {
          alert(res.message);
          this.resetForm();
        } else {
          alert('Error: ' + res.message);
        }
      },
      error: (err) => {
        console.error('Error al registrar proveedor', err);
        alert(err.error?.message || 'Ocurrió un error al registrar el proveedor.');
      }
    });
  }

  private resetForm(): void {
    this.nombreProveedor = '';
    this.nombreContacto = '';

    this.telefono = '';
    this.correo = '';

    this.calle = '';
    this.numero = '';
    this.colonia = '';
    this.ciudad = '';
    this.estado = '';
    this.codigoPostal = '';
    this.pais = '';

    this.componentes = [];
    this.agregarComponente();
  }
}