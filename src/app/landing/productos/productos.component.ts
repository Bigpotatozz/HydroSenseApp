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
  
}
