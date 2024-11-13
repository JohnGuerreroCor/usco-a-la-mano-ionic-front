import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModules } from './material.modules';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { InicioComponent } from './components/inicio/inicio.component';
import { RestauranteComponent } from './components/restaurante/restaurante.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { CredencialesComponent } from './components/inicio/credenciales/credenciales.component';
import { EstudianteComponent } from './components/credencial/estudiante/estudiante.component';
import { AdministrativoComponent } from './components/credencial/administrativo/administrativo.component';
import { GraduadoComponent } from './components/credencial/graduado/graduado.component';
import { VirtualComponent } from './components/credencial/virtual/virtual.component';
import { IntercambioComponent } from './components/credencial/intercambio/intercambio.component';
import { DocenteComponent } from './components/credencial/docente/docente.component';

import { QRCodeModule } from 'angularx-qrcode';
import { VentaComponent } from './components/restaurante/venta/venta.component';
import { ConsumoComponent } from './components/restaurante/consumo/consumo.component';
import { EstadisticasComponent } from './components/restaurante/estadisticas/estadisticas.component';
import { AcademicoEstudianteComponent } from './components/academico-estudiante/academico-estudiante.component';
import { FichaAcademicaComponent } from './components/academico-estudiante/ficha-academica/ficha-academica.component';
import { HorarioEstudianteComponent } from './components/academico-estudiante/horario-estudiante/horario-estudiante.component';
import { MatriculaComponent } from './components/academico-estudiante/matricula/matricula.component';
import { NotasParcialesComponent } from './components/academico-estudiante/notas-parciales/notas-parciales.component';
import { AcademicoDocenteComponent } from './components/academico-docente/academico-docente.component';
import { CargaAcademicaComponent } from './components/academico-docente/carga-academica/carga-academica.component';
import { HorarioDocenteComponent } from './components/academico-docente/horario-docente/horario-docente.component';
import { ListadoEstudiantesComponent } from './components/academico-docente/listado-estudiantes/listado-estudiantes.component';
import { BibliotecaComponent } from './components/biblioteca/biblioteca.component';
import { PeriodoPipe } from './pipes/periodo.pipe';
import { PublicoComponent } from './components/publico/publico.component';
import { SedesComponent } from './components/inicio/sedes/sedes.component';
import { SubSedesComponent } from './components/inicio/sedes/sub-sedes/sub-sedes.component';
import { CentralComponent } from './components/campus/neiva/central/central.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    SedesComponent,
    SubSedesComponent,
    RestauranteComponent,
    VentaComponent,
    ConsumoComponent,
    EstadisticasComponent,
    LoginComponent,
    TokenComponent,
    CredencialesComponent,
    EstudianteComponent,
    AdministrativoComponent,
    GraduadoComponent,
    VirtualComponent,
    IntercambioComponent,
    DocenteComponent,
    AcademicoEstudianteComponent,
    FichaAcademicaComponent,
    HorarioEstudianteComponent,
    MatriculaComponent,
    NotasParcialesComponent,
    AcademicoDocenteComponent,
    CargaAcademicaComponent,
    HorarioDocenteComponent,
    ListadoEstudiantesComponent,
    BibliotecaComponent,
    PublicoComponent,
    CentralComponent,
    PeriodoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot({}),
    BrowserAnimationsModule,
    MaterialModules,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    QRCodeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
