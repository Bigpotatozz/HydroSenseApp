import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LoginComponent } from './login/login.component';
import { PanelClientesComponent } from './panel-clientes/panel-clientes.component';
import { RoleGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '', component: LandingComponent
    },


    {

        path: 'home', 
        component: HomeComponent,
        canActivate: [RoleGuard],
        data: {roles: ['1']},
        
        children: [
             {path: 'usuarios', component: UsuariosComponent}
        ]
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'panelClientes', component: PanelClientesComponent
    }
   
];
