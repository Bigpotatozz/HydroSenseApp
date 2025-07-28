import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateCotizacion } from '../dto/cotizaciones/createCotizacion.dto';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

  private url: string =  'https://localhost:7160';


  constructor(private httpClient: HttpClient) { }


  postCotizacion(cotizacion: CreateCotizacion){

    return this.httpClient.post(`${this.url}/api/Cotizacion`, cotizacion);

  }
}
