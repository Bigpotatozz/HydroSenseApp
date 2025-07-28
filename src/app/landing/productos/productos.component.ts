import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CreateCotizacion } from '../../dto/cotizaciones/createCotizacion.dto';
import { LandingService } from '../../services/landing.service';

@Component({
  selector: 'app-productos',
  imports: [CardModule, ButtonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  

  cantidad: number = 0;
  email: string = "";
  nombre: string = "";

  constructor(private landingService: LandingService){}

  onSubmit() {

    let cotizacion = new CreateCotizacion(this.nombre, this.email, `Se necesitan ${this.cantidad} sensores`);
    this.landingService.postCotizacion(cotizacion).subscribe({
      next: (data) => {
        console.log('Cotización enviada:', data);
        alert("Solicitud de cotizacion enviada correctamente")
      },
      error: (error) => {
        console.error(error)
      }
    });
  }

}
