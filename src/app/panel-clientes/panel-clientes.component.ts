import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicionesService } from '../services/mediciones.service';
import { AuthService } from '../services/auth.service';

interface MedicionDTO {
  nombreSistema: string;
  nombreFuente: string;
  ph: number | null;
  turbidez: number | null;
  temperatura: number | null;
}

@Component({
  selector: 'app-panel-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-clientes.component.html',
  styleUrls: ['./panel-clientes.component.css']
})
export class PanelClientesComponent implements OnInit {

  userId: number | null = null;
  medicionData: MedicionDTO | null = null;
  estadoGeneralAgua: string = 'Cargando...';
  estadoPh: string = 'Cargando...';
  estadoTurbidez: string = 'Cargando...';
  estadoTemperatura: string = 'Cargando...';
  comentarioTexto: string = '';

  constructor(
    private medicionesService: MedicionesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const initialUserId = this.authService.getLoggedInUserId();
    if (initialUserId) {
      this.userId = initialUserId;
      this.getMediciones(this.userId);
    } else {
      this.establecerEstadosSinDatos();
    }

    this.authService.currentUser.subscribe(user => {
      const currentUserId = user ? user.idUsuario : null;
      if (this.userId !== currentUserId) {
        this.userId = currentUserId;
        if (this.userId) {
          this.getMediciones(this.userId);
        } else {
          this.medicionData = null;
          this.establecerEstadosSinDatos();
        }
      }
    });
  }

  getMediciones(idUsuario: number): void {
    this.medicionesService.getMedicionesPorUsuario(idUsuario).subscribe({
      next: (response) => {
        if (response.success && response.data?.sensores?.length > 0) {
          this.medicionData = response.data.sensores[0]; 
          this.calcularEstadosAgua();
        } else {
          this.estadoGeneralAgua = 'No hay datos de medición.';
          this.medicionData = null;
        }
      },
      error: (error) => {
        this.estadoGeneralAgua = 'Error al cargar datos.';
        console.error('Error al obtener mediciones:', error);
      }
    });
  }

  establecerEstadosSinDatos(): void {
    this.estadoGeneralAgua = 'No hay usuario logueado o datos.';
    this.estadoPh = 'Sin datos';
    this.estadoTurbidez = 'Sin datos';
    this.estadoTemperatura = 'Sin datos';
  }

  calcularEstadosAgua(): void {
    if (!this.medicionData) return;

    const { ph, turbidez, temperatura } = this.medicionData;

    // PH
    this.estadoPh = ph === null ? 'Sin datos' :
      ph >= 6.5 && ph <= 8.5 ? 'Neutro (Ideal para regar plantas o limpieza)' :
        (ph >= 8.6 && ph <= 9.0) || (ph >= 6.0 && ph < 6.5) ? 'Preocupante' :
          'Malo';

    // Turbidez
    this.estadoTurbidez = turbidez === null ? 'Sin datos' :
      turbidez <= 1.0 ? 'Agua potable' :
        turbidez >= 1.1 && turbidez <= 4.0 ? 'Preocupante' :
          'Malo';

    // Temperatura
    this.estadoTemperatura = temperatura === null ? 'Sin datos' :
      temperatura >= 5 && temperatura <= 25 ? 'Temperatura ideal' :
        temperatura >= 25.1 && temperatura <= 35 ? 'Preocupante' :
          'Malo';

    const esMalo =
      (ph !== null && (ph < 6.0 || ph > 9.0)) ||
      (turbidez !== null && turbidez > 4.0) ||
      (temperatura !== null && temperatura > 35);

    const esPreocupante =
      (ph !== null && ((ph >= 8.6 && ph <= 9.0) || (ph >= 6.0 && ph < 6.5))) ||
      (turbidez !== null && (turbidez >= 1.1 && turbidez <= 4.0)) ||
      (temperatura !== null && (temperatura >= 25.1 && temperatura <= 35));

    const esBueno = !esMalo && !esPreocupante &&
      ph !== null && ph >= 6.5 && ph <= 8.5 &&
      turbidez !== null && turbidez <= 1.0 &&
      temperatura !== null && temperatura >= 5 && temperatura <= 25;

    this.estadoGeneralAgua = esMalo ? 'Malo' : esPreocupante ? 'Preocupante' : esBueno ? 'Bueno' : 'Desconocido';
  }

  enviarComentario(): void {
    if (!this.userId || !this.comentarioTexto.trim()) return;

    const reviewDto = {
      idUsuario: this.userId,
      comentarioTexto: this.comentarioTexto
    };

    this.medicionesService.enviarComentario(reviewDto).subscribe({
      next: (response) => {
        if (response.success) {
          this.comentarioTexto = '';
        }
      },
      error: (error) => {
        console.error('Error al enviar comentario:', error);
      }
    });
  }
  leerDocumentacion() {
    window.open('assets/ProyectoFinal2025.pdf', '_blank');
  }


}
