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
  console.log('[REGISTRO] Click Guardar');

  const dto: ProveedorRegistrarDTO = {
    idProveedor: 0,
    nombreProveedor: this.nombreProveedor?.trim(),
    nombreContacto: this.nombreContacto?.trim(),
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

  const faltantes: string[] = [];
if (!dto.nombreProveedor) faltantes.push('Nombre del proveedor');
if (!dto.nombreContacto) faltantes.push('Nombre del contacto');
if (!this.telefono) faltantes.push('Teléfono');
if (!this.correo) faltantes.push('Email');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (this.correo && !emailRegex.test(this.correo)) faltantes.push('Email (formato inválido)');

const telRegex = /^[0-9+\-\s]{7,20}$/;
if (this.telefono && !telRegex.test(this.telefono)) faltantes.push('Teléfono (formato inválido)');

if (faltantes.length > 0) {
  alert('Faltan o son inválidos los siguientes campos:\n- ' + faltantes.join('\n- '));
  console.warn('[REGISTRO] Campos faltantes/invalidos:', faltantes, 'DTO:', dto);
  return;
}

  console.log('[REGISTRO] Enviando DTO:', dto);

  this.proveedorService.registrarProveedorConComponentes(dto).subscribe({
    next: (res) => {
      console.log('[REGISTRO] Respuesta API:', res);
      if (res.success) {
        alert(res.message || 'Proveedor registrado correctamente');
        this.resetForm();
      } else {
        alert('Error: ' + (res.message || 'No se pudo registrar el proveedor.'));
      }
    },
    error: (err) => {
      console.error('[REGISTRO] Error API:', err);
      const msg = err?.error?.message || err?.message || 'Error al registrar el proveedor.';
      alert(msg);
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