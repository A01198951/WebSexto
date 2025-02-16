import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { routes } from './app.routes';
// Se importan las librerias necesarias para el funcionamiento de la aplicacion
@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppComponent,
    LoginComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

