import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CarreraComponent } from './pages/carrera/carrera.component';
import { InformesComponent } from './pages/informes/informes.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'carrera', component: CarreraComponent, canActivate: [AuthGuard] },
  { path: 'informes', component: InformesComponent, canActivate: [AuthGuard] }
];