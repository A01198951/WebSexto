import { Component } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  returnUrl: string = '/home';
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Get return URL from route parameters or default to '/home'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  async onLogin() {
    console.log('Iniciando login...');
    if (this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    try {
      // Add await here to properly handle the Promise
      const success = await this.authService.login(this.email, this.password);
      
      if (success) {
        console.log('Login exitoso, redirigiendo a:', this.returnUrl);
        this.router.navigate([this.returnUrl]);
      } else {
        this.errorMessage = 'Credenciales inválidas';
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.isSubmitting = false;
    }
  }
  
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo electrónico';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/invalid-email':
        return 'El formato del correo electrónico no es válido';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Por favor, inténtalo más tarde';
      default:
        return 'Error al iniciar sesión: ' + errorCode;
    }
  }
}