import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]  // Added RouterModule here
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  firestoreData: any[] = [];

  constructor(
    private router: Router,
    private firestore: Firestore
  ) {
    this.fetchAllData();
  }

  async onLogin() {
    try {
      if (!this.email || !this.password) {
        this.errorMessage = 'Por favor ingrese email y contraseña';
        return;
      }
  
      console.log('Intentando login con:', {
        email: this.email,
        password: this.password
      });
      
      // Log all users for debugging
      console.log('Lista completa de usuarios:', this.firestoreData);
  
      const user = this.firestoreData.find(item => {
        const storedEmail = item.email?.toLowerCase().trim() || '';
        const storedPassword = item[' password'] || item.password || '';
        const inputEmail = this.email.toLowerCase().trim();
        
        console.log('Comparando con usuario:', {
          storedEmail,
          storedPassword,
          inputEmail,
          inputPassword: this.password,
          matches: {
            email: storedEmail === inputEmail,
            password: storedPassword === this.password
          }
        });
        
        return storedEmail === inputEmail && storedPassword === this.password;
      });
  
      if (user) {
        console.log('Usuario encontrado:', user);
        this.errorMessage = '';
        
        // Save user to localStorage if you want to keep session
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Use explicit navigation with result handling
        this.router.navigate(['/home']).then(success => {
          console.log('Navegación exitosa:', success);
          if (!success) {
            console.warn('La ruta /home puede no estar configurada correctamente');
          }
        }).catch(err => {
          console.error('Error en la navegación:', err);
        });
      } else {
        this.errorMessage = 'Correo o contraseña incorrectos';
        console.warn('No se encontró usuario con esas credenciales');
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.errorMessage = 'Ocurrió un error durante el inicio de sesión';
    }
  }

  async fetchAllData() {
    try {
      const userCollection = collection(this.firestore, 'User');
      const querySnapshot = await getDocs(userCollection);
      this.firestoreData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Datos obtenidos de Firestore:', this.firestoreData);
    } catch (error) {
      console.error('Error al obtener datos de Firestore:', error);
      this.errorMessage = 'Error al cargar los datos';
    }
  }
}