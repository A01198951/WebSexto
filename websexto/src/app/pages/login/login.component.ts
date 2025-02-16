import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  // Propiedades para el usuario y contraseña
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}
  // Método para validar el usuario y contraseña
  login() {
    if (this.username === 'admin' && this.password === '1234') {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Credenciales incorrectas';
    }
  }
}