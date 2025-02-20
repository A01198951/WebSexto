import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
    // Comprueba si el usuario está autenticado
  canActivate(): boolean {
    if (this.authService.isAuth()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}