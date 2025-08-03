import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../services/proveedor.service';
import { ProveedorConComponentesDTO, ComponenteRegistroDTO } from '../dto/proveedores/createProveedores.dto';
import { HttpClientModule } from '@angular/common/http'; 
@Component({
  selector: 'app-registro-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './registro-proveedor.component.html',
  styleUrls: ['./registro-proveedor.component.css']
})
export class RegistroProveedorComponent implements OnInit {

  nombreProveedor: string = '';
  nombreContacto: string = '';
  componentes: ComponenteRegistroDTO[] = [];

  constructor(private proveedorService: ProveedorService) { }

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

  eliminarComponente(index: number): void {
    if (this.componentes.length > 1) { 
      this.componentes.splice(index, 1);
    }
  }

  registrarProveedor(): void {
    const proveedorData: ProveedorConComponentesDTO = {
      nombreProveedor: this.nombreProveedor,
      nombreContacto: this.nombreContacto,
      componentes: this.componentes.filter(c => c.nombreComponente && c.cantidad > 0) 
    };

    if (proveedorData.componentes.length === 0) {
      alert('Debe agregar al menos un componente con nombre y cantidad para registrar al proveedor.');
      return;
    }

    this.proveedorService.registrarProveedorConComponentes(proveedorData).subscribe({
      next: (res) => {
        if (res.success) {
          alert(res.message);
          this.resetForm(); 
        } else {
          alert('Error al registrar proveedor: ' + res.message);
        }
      },
      error: (err) => {
        console.error('Error al registrar proveedor', err);
        alert('Ocurrió un error al registrar el proveedor. Intenta de nuevo.');
      }
    });
  }

  resetForm(): void {
    this.nombreProveedor = '';
    this.nombreContacto = '';
    this.componentes = [];
    this.agregarComponente(); 
  }
}
