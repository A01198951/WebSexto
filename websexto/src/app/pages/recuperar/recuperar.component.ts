import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RecuperarComponent {
  usuario = {
    correo: '',
  };

  recuperar() {
    console.log('Solicitud de recuperación para:', this.usuario.correo);
    alert('Se ha enviado un correo de recuperación a ' + this.usuario.correo);
  }

  limpiarFormulario() {
    this.usuario.correo = '';
  }
}