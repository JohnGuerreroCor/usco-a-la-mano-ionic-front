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

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    RestauranteComponent,
    LoginComponent,
    TokenComponent,
    CredencialesComponent,
    EstudianteComponent,
    AdministrativoComponent,
    GraduadoComponent,
    VirtualComponent,
    IntercambioComponent,
    DocenteComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
