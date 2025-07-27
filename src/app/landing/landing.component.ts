import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Toolbar } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { InicioComponent } from "./inicio/inicio.component";
import { NosotrosComponent } from "./nosotros/nosotros.component";
import { PreguntasComponent } from "./preguntas/preguntas.component";
import { ProductosComponent } from "./productos/productos.component";
import { ContactoComponent } from "./contacto/contacto.component";
import { OpinionComponent } from "./opinion/opinion.component";

@Component({
  selector: 'app-landing',
  imports: [Toolbar, AvatarModule, ButtonModule, RouterModule, InicioComponent, NosotrosComponent, PreguntasComponent, ProductosComponent, ContactoComponent, OpinionComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
