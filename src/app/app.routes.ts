import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LoginComponent } from './login/login.component';
import { PanelClientesComponent } from './panel-clientes/panel-clientes.component';
import { RoleGuard } from './guards/auth.guard';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { DetalleProveedorComponent } from './proveedores/detalle-proveedor.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { ProduccionComponent } from './produccion/produccion.component';
import { VentaComponent } from './ventas/ventas.component';
import { InventarioComponent } from './inventario/inventario.component';
import { DashboardComponent } from './dashboard/dashboard.component';


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
          { path: 'usuarios', component: UsuariosComponent },
          { path: 'comentarios', component: ComentariosComponent },
          { path: 'proveedores', component: ProveedoresComponent },
          {
            path: 'proveedores/detalle', 
            component: DetalleProveedorComponent,
            canActivate: [RoleGuard], 
            data: { roles: ['1'] } 
          },
          { path: 'cotizaciones', component: CotizacionesComponent },
          { path: 'produccion', component: ProduccionComponent },
          { path: 'ventas', component: VentaComponent },
          { path: 'inventario', component: InventarioComponent },
          { path: 'dashboard', component: DashboardComponent }
        ]
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'panelClientes', 
        component: PanelClientesComponent,
        canActivate: [RoleGuard],
      data: { roles: ['2'] },

    }
   
];
