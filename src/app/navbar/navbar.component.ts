import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [
    ToolbarModule,
    AvatarModule,
    ButtonModule,
    RouterModule,
    MenubarModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  secciones: MenuItem[] = [];
  nombreUsuario: string = "";

  constructor(private router: Router) { }

  ngOnInit() {
    let storageUsuario = localStorage.getItem("usuario");
    if (!storageUsuario) return;

    let usuario = JSON.parse(storageUsuario);
    this.nombreUsuario = usuario.nombre;

    this.secciones = [
      {
        label: 'Ventas',
        items: [
          { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: ['/home/dashboard'] },
          { label: 'Vender', icon: 'pi pi-shopping-cart', routerLink: ['/home/ventas'] },
          { label: 'Cotizaciones', icon: 'pi pi-file-o', routerLink: ['/home/cotizaciones'] }
        ]
      },
      {
        label: 'Usuario',
        items: [
          { label: 'Usuarios', icon: 'pi pi-users', routerLink: ['/home/usuarios'] },
          { label: 'Comentarios', icon: 'pi pi-comments', routerLink: ['/home/comentarios'] }
        ]
      },
      {
        label: 'Proveedores',
        items: [
          { label: 'Comprar componentes', icon: 'pi pi-inbox', routerLink: ['/home/proveedores'] },
          { label: 'Registrar proveedores', icon: 'pi pi-plus', routerLink: ['/home/registro-proveedor'] }
        ]
      },
      {
        label: 'Productos',
        items: [
          { label: 'Producción', icon: 'pi pi-hammer', routerLink: ['/home/produccion'] },
          { label: 'Inventario', icon: 'pi pi-box', routerLink: ['/home/inventario'] }
        ]
      }
    ];
  }

  cerrarSesion() {
    localStorage.removeItem("usuario");
    this.router.navigate(['/login']);
  }
}
