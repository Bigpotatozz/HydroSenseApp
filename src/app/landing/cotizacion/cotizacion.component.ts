import { Component } from '@angular/core';
import { LandingService } from '../../services/landing.service';
import { CreateCotizacion } from '../../dto/cotizaciones/createCotizacion.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cotizacion',
  imports: [FormsModule],
  templateUrl: './cotizacion.component.html',
  styleUrl: './cotizacion.component.css'
})
export class CotizacionComponent {

  
  email: string = "";
  nombre: string = "";
  descripcion: string = "";

  constructor(private landingService: LandingService){}

  onSubmit() {

    let cotizacion = new CreateCotizacion(this.nombre, this.email, `${this.descripcion}`);
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
