// En tu componente de proveedores (proveedores.component.ts)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProveedorService } from '../services/proveedor.service';
import { Router } from '@angular/router';

import {
  ProveedorConComponentesDTO,
  ApiResponse
} from '../dto/proveedores/showProveedores.dto';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  proveedores: ProveedorConComponentesDTO[] = [];

  constructor(private proveedorService: ProveedorService,
    private router: Router) { }

  ngOnInit(): void {
    this.proveedorService.obtenerProveedoresConComponentes().subscribe({
      next: (res: ApiResponse<ProveedorConComponentesDTO[]>) => {
        if (res.success) {
          this.proveedores = res.data;
        }
      },
      error: (err) => console.error('Error al obtener proveedores', err)
    });
  }

  verDetalle(proveedor: ProveedorConComponentesDTO, id: number): void {
    this.router.navigate(['/home/proveedores/detalle'], {
      queryParams: {
        id,
        proveedor: proveedor.nombreProveedor,
        contacto: proveedor.nombreContacto
      }
    });
  }
}
