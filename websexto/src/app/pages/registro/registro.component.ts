import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegistroComponent {
  usuario = {
    nombre: '',
    correo: '',
    password: '',
    confirmarPassword: '',
    fechaNacimiento: ''
  };

  registrar() {
    // Esta función se activará cuando se envíe el formulario
    console.log('Datos del usuario:', this.usuario);
    // Aquí se implementaría la lógica para enviar los datos al backend
    alert('Registro exitoso (simulación)');
  }

  limpiarFormulario() {
    this.usuario = {
      nombre: '',
      correo: '',
      password: '',
      confirmarPassword: '',
      fechaNacimiento: ''
    };
  }
}