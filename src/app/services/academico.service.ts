import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Matricula } from '../models/matricula';
import { Periodo } from '../models/periodo';
import { FichaAcademica } from '../models/ficha-academica';
import { FichaAcademicaRegistro } from '../models/ficha-academica-registro';
import { DiaHorario } from '../models/dia-horario';
import { Notas } from '../models/notas';
import { CargaAcademica } from '../models/carga-academica';
import { EstudiantesCurso } from '../models/estudiantes-curso';
import { HorarioEstudiante } from '../models/horario-estudiante';
import { HorarioDocente } from '../models/horario-docente';

@Injectable({
  providedIn: 'root',
})
export class AcademicoService {
  private url: string = `${environment.URL_BACKEND}/academico`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  userLogeado: String = this.authservice.user.username;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authservice: AuthService
  ) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e: any): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  //MATRÍCULA

  obtenerPlanAcademico(estudianteCodigo: string): Observable<number> {
    return this.http.get<number>(
      `${this.url}/obtener-plan-academico/${estudianteCodigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerPeridoActual(): Observable<string> {
    return this.http.get<string>(`${this.url}/obtener-periodo-actual`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  obtenerMatriculaActual(
    planAcademico: number,
    estudianteCodigo: string,
    periodo: string
  ): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(
      `${this.url}/obtener-matricula-actual/${planAcademico}/${estudianteCodigo}/${periodo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerMatriculas(
    planAcademico: number,
    estudianteCodigo: string
  ): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(
      `${this.url}/obtener-matriculas/${planAcademico}/${estudianteCodigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  //FICHA ACADÉMICA

  obtenerPuntajePonderado(estudianteCodigo: string): Observable<number> {
    return this.http.get<number>(
      `${this.url}/obtener-puntaje-ponderado/${estudianteCodigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerFichaAcademica(
    planAcademico: number,
    estudianteCodigo: string
  ): Observable<FichaAcademica[]> {
    return this.http.get<FichaAcademica[]>(
      `${this.url}/obtener-ficha-academica/${planAcademico}/${estudianteCodigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerFichaAcademicaCursos(
    planAcademico: number,
    estudianteCodigo: string
  ): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(
      `${this.url}/obtener-ficha-academica-cursos/${planAcademico}/${estudianteCodigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerFichaAcademicaRegistro(
    estudianteCodigo: string
  ): Observable<FichaAcademicaRegistro[]> {
    return this.http.get<FichaAcademicaRegistro[]>(
      `${this.url}/obtener-ficha-academica-registro/${estudianteCodigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  //HORARIO ESTUDIANTE

  obtenerDiasHorarioEstudiante(
    estudianteCodigo: string,
    periodo: string
  ): Observable<DiaHorario[]> {
    return this.http.get<DiaHorario[]>(
      `${this.url}/obtener-dias-horario-estudiante/${estudianteCodigo}/${periodo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerHorarioEstudiante(
    estudianteCodigo: string,
    periodo: string
  ): Observable<HorarioEstudiante[]> {
    return this.http.get<HorarioEstudiante[]>(
      `${this.url}/obtener-horario-estudiante/${estudianteCodigo}/${periodo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  //NOTAS PARCIALES
  obtenerNotasParciales(
    estudianteCodigo: string,
    planAcademico: number,
    periodo: string
  ): Observable<Notas[]> {
    return this.http.get<Notas[]>(
      `${this.url}/obtener-notas-parciales/${estudianteCodigo}/${planAcademico}/${periodo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  //CARGA ACADÉMICA
  obtenerCargaAcademica(
    personaCodigo: number,
    periodo: string
  ): Observable<CargaAcademica[]> {
    return this.http.get<CargaAcademica[]>(
      `${this.url}/obtener-carga-academica/${personaCodigo}/${periodo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerListadoEstudiantes(
    cursoCodigo: number
  ): Observable<EstudiantesCurso[]> {
    return this.http.get<EstudiantesCurso[]>(
      `${this.url}/obtener-listado-estudiantes/${cursoCodigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  //HORARIO DOCENTE

  obtenerDiasHorarioDocente(
    personaCodigo: number,
    periodo: string
  ): Observable<DiaHorario[]> {
    return this.http.get<DiaHorario[]>(
      `${this.url}/obtener-dias-horario-docente/${personaCodigo}/${periodo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerHorarioDocente(
    personaCodigo: number,
    periodo: string
  ): Observable<HorarioDocente[]> {
    return this.http.get<HorarioDocente[]>(
      `${this.url}/obtener-horario-docente/${personaCodigo}/${periodo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
