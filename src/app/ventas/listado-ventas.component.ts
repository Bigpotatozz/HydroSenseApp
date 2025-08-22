// src/app/ventas/listado-ventas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-listado-ventas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './listado-ventas.component.html',
  styleUrls: ['./listado-ventas.component.css']
})
export class ListadoVentasComponent implements OnInit {
  ventas: any[] = [];
  cargando = false;
  error = '';
  private url = 'https://localhost:7160';

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.auth.getCurrentUserToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.cargando = true;
    this.error = '';

    const token = this.auth.getCurrentUserToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    this.http.get<any>(`${this.url}/api/Venta/listado`, { headers }).subscribe({
      next: (res) => {
        this.ventas = res?.data || [];
        this.cargando = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo obtener el listado de ventas';
        this.cargando = false;
        console.error(err);
      }
    });
  }
}
