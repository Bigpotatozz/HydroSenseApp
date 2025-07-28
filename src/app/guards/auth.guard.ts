import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      this.router.navigate(['/login']);
      return false;
    }

    const userJson = JSON.parse(usuario);
    const rol = userJson.nivel;

    const allowedRoles: string[] = route.data['roles'];

    if (!rol) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!allowedRoles.includes(rol)) {
      this.router.navigate(['/acceso-denegado']);
      return false;
    }

    return true;
  }
}
