import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { RestauranteComponent } from './components/restaurante/restaurante.component';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { AuthGuard } from './guard/auth.guard';
import { CredencialesComponent } from './components/inicio/credenciales/credenciales.component';
import { EstudianteComponent } from './components/credencial/estudiante/estudiante.component';
import { VentaComponent } from './components/restaurante/venta/venta.component';
import { ConsumoComponent } from './components/restaurante/consumo/consumo.component';
import { EstadisticasComponent } from './components/restaurante/estadisticas/estadisticas.component';
import { AcademicoEstudianteComponent } from './components/academico-estudiante/academico-estudiante.component';
import { NotasParcialesComponent } from './components/academico-estudiante/notas-parciales/notas-parciales.component';
import { HorarioEstudianteComponent } from './components/academico-estudiante/horario-estudiante/horario-estudiante.component';
import { FichaAcademicaComponent } from './components/academico-estudiante/ficha-academica/ficha-academica.component';
import { MatriculaComponent } from './components/academico-estudiante/matricula/matricula.component';
import { BibliotecaComponent } from './components/biblioteca/biblioteca.component';
import { CargaAcademicaComponent } from './components/academico-docente/carga-academica/carga-academica.component';
import { HorarioDocenteComponent } from './components/academico-docente/horario-docente/horario-docente.component';
import { ListadoEstudiantesComponent } from './components/academico-docente/listado-estudiantes/listado-estudiantes.component';
import { AcademicoDocenteComponent } from './components/academico-docente/academico-docente.component';
import { AdministrativoComponent } from './components/credencial/administrativo/administrativo.component';
import { GraduadoComponent } from './components/credencial/graduado/graduado.component';
import { DocenteComponent } from './components/credencial/docente/docente.component';
import { IntercambioComponent } from './components/credencial/intercambio/intercambio.component';
import { VirtualComponent } from './components/credencial/virtual/virtual.component';
import { PublicoComponent } from './components/publico/publico.component';
import { SedesComponent } from './components/inicio/sedes/sedes.component';
import { SubSedesComponent } from './components/inicio/sedes/sub-sedes/sub-sedes.component';
import { CentralComponent } from './components/campus/neiva/central/central.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },
  { path: 'publico', component: PublicoComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
  { path: 'sedes', component: SedesComponent, canActivate: [AuthGuard] },
  { path: 'sub-sedes', component: SubSedesComponent, canActivate: [AuthGuard] },
  {
    path: 'biblioteca',
    component: BibliotecaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'credenciales',
    component: CredencialesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'estudiante',
    component: EstudianteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'administrativo',
    component: AdministrativoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'graduado',
    component: GraduadoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'docente',
    component: DocenteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'estudiante-intercambio',
    component: IntercambioComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'estudiante-virtual',
    component: VirtualComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'restaurante',
    component: RestauranteComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'ventanilla',
        component: VentaComponent,
      },
      {
        path: 'consumo',
        component: ConsumoComponent,
      },
      {
        path: 'estadisticas',
        component: EstadisticasComponent,
      },
    ],
  },
  {
    path: 'academico-estudiante',
    component: AcademicoEstudianteComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'matricula',
        component: MatriculaComponent,
      },
      {
        path: 'ficha-academica',
        component: FichaAcademicaComponent,
      },
      {
        path: 'horario-estudiante',
        component: HorarioEstudianteComponent,
      },
      {
        path: 'notas-parciales',
        component: NotasParcialesComponent,
      },
    ],
  },
  {
    path: 'academico-docente',
    component: AcademicoDocenteComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'carga-academica',
        component: CargaAcademicaComponent,
      },
      {
        path: 'horario-docente',
        component: HorarioDocenteComponent,
      },
      {
        path: 'listado-estudiantes/:id',
        component: ListadoEstudiantesComponent,
      },
    ],
  },
  {
    path: 'listado-estudiantes/:id',
    component: ListadoEstudiantesComponent,
  },
  {
    path: 'campus-neiva-central',
    component: CentralComponent,
  },
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
