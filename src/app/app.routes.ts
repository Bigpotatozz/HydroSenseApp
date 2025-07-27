import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: '', component: LandingComponent
    },


    {
        path: 'home', component: HomeComponent,
        children: [
             {path: 'usuarios', component: UsuariosComponent}
        ]
    },
    {
        path: 'login', component: LoginComponent
    }
   
];
