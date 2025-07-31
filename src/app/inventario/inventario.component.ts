import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { InventarioService } from '../services/inventario.service';
import { ComponenteInventarioDTO } from '../dto/inventario/showInventario.dto';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  componentes: ComponenteInventarioDTO[] = [];

  constructor(private inventarioService: InventarioService, private router: Router) { }

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario(): void {
    this.inventarioService.getInventarioComponentes().subscribe({
      next: (res) => {
        if (res.success) {
          this.componentes = res.data;
        } else {
          alert('Error al cargar inventario: ' + res.message);
        }
      },
      error: (err) => {
        alert('Error en la API de inventario: ' + (err.error?.message || err.message));
      }
    });
  }

  comprarMas(): void {
    this.router.navigate(['/home/proveedores']);
  }
}
