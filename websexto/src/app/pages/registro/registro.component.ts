import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegistroComponent implements OnInit {
  usuario = {
    nombre: '',
    correo: '',
    password: '',
    confirmarPassword: '',
    fechaNacimiento: ''
  };
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Registro component initialized');
  }

  async registrar() {
    console.log('Método registrar() iniciado - PRESIONADO BOTÓN');
    
    if (this.isSubmitting) {
      console.log('Ya hay un registro en curso. Evitando múltiples envíos.');
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    // Validar formulario
    if (!this.usuario.nombre || !this.usuario.correo || !this.usuario.password || !this.usuario.fechaNacimiento) {
      this.errorMessage = 'Por favor complete todos los campos';
      this.isSubmitting = false;
      console.log('Validación fallida: campos incompletos');
      return;
    }
    
    if (this.usuario.password !== this.usuario.confirmarPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      this.isSubmitting = false;
      console.log('Validación fallida: contraseñas no coinciden');
      return;
    }
  
    try {
      const userData = {
        nombre: this.usuario.nombre.trim(),
        fechaNacimiento: this.usuario.fechaNacimiento.trim()
      };
  
      console.log('Llamando a authService.register() con datos:', userData);
      
      // Mostrar estado
      alert('Iniciando registro...');
      
      await this.authService.register(
        this.usuario.correo.trim(),
        this.usuario.password.trim(),
        userData
      );
  
      console.log('Registro exitoso - preparándose para redireccionar');
      alert('Registro exitoso');
      
      // Navegación al login
      this.router.navigate(['/login']).then(success => {
        console.log('Navegación a login:', success ? 'exitosa' : 'fallida');
      }).catch(err => {
        console.error('Error en navegación:', err);
        window.location.href = '/login'; // Navegación alternativa
      });
      
    } catch (error: any) {
      console.error('Error completo en registro:', error);
      alert('Error en registro: ' + (error.message || 'Error desconocido'));
      this.errorMessage = this.getErrorMessage(error.code || 'unknown');
    } finally {
      this.isSubmitting = false;
      console.log('Proceso de registro finalizado');
    }
  }

  private getErrorMessage(errorCode: string): string {
    console.log('Error code:', errorCode);
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este correo electrónico ya está registrado';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'unknown':
        return 'Ocurrió un error inesperado durante el registro';
      default:
        return `Ocurrió un error durante el registro: ${errorCode}`;
    }
  }

  limpiarFormulario() {
    console.log('Limpiando formulario');
    this.usuario = {
      nombre: '',
      correo: '',
      password: '',
      confirmarPassword: '',
      fechaNacimiento: ''
    };
    this.errorMessage = '';
  }
}