import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { RestauranteComponent } from './components/restaurante/restaurante.component';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { AuthGuard } from './guard/auth.guard';
import { CredencialesComponent } from './components/inicio/credenciales/credenciales.component';
import { EstudianteComponent } from './components/credencial/estudiante/estudiante.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
  { path: 'credenciales', component: CredencialesComponent, canActivate: [AuthGuard] },
  { path: 'estudiante', component: EstudianteComponent, canActivate: [AuthGuard] },
  { path: 'restaurante', component: RestauranteComponent, canActivate: [AuthGuard]  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}