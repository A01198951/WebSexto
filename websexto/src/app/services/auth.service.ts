import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
// Inyecta el servicio Router
  constructor(private router: Router) { }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }
  // Cierra la sesión del usuario
  logout(): void {
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
  // Devuelve si el usuario está autenticado
  isAuth(): boolean {
    return this.isAuthenticated;
  }
}