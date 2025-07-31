import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface UserData {
  idUsuario: number;
  nombre: string;
  nivel: string; 
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  correo?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserData | null>;
  public currentUser: Observable<UserData | null>;

  constructor() {
    const storedUser = localStorage.getItem('usuario');
    const initialUser: UserData | null = storedUser ? JSON.parse(storedUser) : null;

    this.currentUserSubject = new BehaviorSubject<UserData | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  getLoggedInUserId(): number | null {
    return this.currentUserSubject.value ? this.currentUserSubject.value.idUsuario : null;
  }

  getLoggedInUserLevel(): string | null {
    return this.currentUserSubject.value ? this.currentUserSubject.value.nivel : null;
  }

  login(userData: UserData): void {
    localStorage.setItem('usuario', JSON.stringify(userData));
    this.currentUserSubject.next(userData);
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.currentUserSubject.next(null);
  }
}
