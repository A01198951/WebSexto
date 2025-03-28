import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection, addDoc, getDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserId: string | null = null;

  constructor(
    private firestore: Firestore,
    private router: Router
  ) {
    // Intentar recuperar el ID del usuario del almacenamiento local al iniciar
    this.currentUserId = localStorage.getItem('currentUserId');
  }

  async register(email: string, password: string, userData: any): Promise<void> {
    console.log('AuthService: Guardando datos de usuario en Firestore sin autenticación');
    try {
      // Verificar si el correo ya existe
      const userQuery = query(
        collection(this.firestore, 'User'),
        where('email', '==', email)
      );
      
      const querySnapshot = await getDocs(userQuery);
      
      if (!querySnapshot.empty) {
        throw { code: 'auth/email-already-in-use', message: 'Este correo ya está registrado' };
      }
      
      // Crear un nuevo ID único para el usuario
      const userCollection = collection(this.firestore, 'User');
      
      // Crear documento con los datos del usuario
      const userDoc = await addDoc(userCollection, {
        email: email,
        password: password,  // NOTA: No es seguro guardar contraseñas en texto plano
        nombre: userData.nombre || '',
        fechaNacimiento: userData.fechaNacimiento || '',
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      console.log('Documento creado con ID:', userDoc.id);
      
      // Actualizar el documento con su propio ID
      await setDoc(userDoc, { 
        id: userDoc.id,
        uid: userDoc.id 
      }, { merge: true });
      
      console.log('Datos de usuario guardados correctamente en Firestore');
    } catch (error) {
      console.error('Error al guardar datos de usuario:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      console.log('Intentando login con email:', email);
      
      // Buscar usuario por email
      const userQuery = query(
        collection(this.firestore, 'User'),
        where('email', '==', email),
        where('password', '==', password)
      );
      
      const querySnapshot = await getDocs(userQuery);
      
      if (querySnapshot.empty) {
        console.log('Usuario no encontrado o contraseña incorrecta');
        return false;
      }
      
      // Obtener el ID del primer documento que coincide
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      
      // Guardar el ID del usuario en localStorage para mantener la sesión
      localStorage.setItem('currentUserId', userId);
      this.currentUserId = userId;
      
      // Actualizar la fecha de último inicio de sesión
      await setDoc(doc(this.firestore, 'User', userId), {
        lastLogin: new Date()
      }, { merge: true });
      
      console.log('Login exitoso para el usuario con ID:', userId);
      return true;
    } catch (error) {
      console.error('Error durante el login:', error);
      return false;
    }
  }
  
  // Método para cerrar sesión
  async logout(): Promise<void> {
    console.log('Cerrando sesión...');
    localStorage.removeItem('currentUserId');
    this.currentUserId = null;
  }
  
  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.currentUserId;
  }
  
  // Método para obtener el ID del usuario actual
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }
  
  // Método para obtener los datos del usuario actual
  async getCurrentUserData(): Promise<any | null> {
    if (!this.currentUserId) {
      return null;
    }
    
    try {
      const userDoc = await getDoc(doc(this.firestore, 'User', this.currentUserId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  }
}