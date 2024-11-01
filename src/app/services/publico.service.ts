import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estudiante } from '../models/estudiante';
import { Persona } from '../models/persona';
import { Graduado } from '../models/graduado';
import { Administrativo } from '../models/administrativo';
import { Docente } from '../models/docente';
import { Tercero } from '../models/tercero';
import { Ticket } from '../models/ticket';
import { PoliticaEstamento } from '../models/politica-estamento';
import { Foto } from '../models/foto';

@Injectable({
  providedIn: 'root',
})
export class PublicoService {
  private url: string = `${environment.URL_BACKEND}/publico`;

  constructor(private http: HttpClient) {}

  getEstudiante(codigo: any): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.url}/estudiante-get/${codigo}`);
  }

  buscarEstudianteIdentifiacion(id: any): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(
      `${this.url}/buscar-estudiante-identificacion/${id}`
    );
  }

  obtenerGraduado(codigo: String): Observable<Graduado[]> {
    return this.http.get<Graduado[]>(`${this.url}/obtener-graduado/${codigo}`);
  }

  getAdministrativo(id: any): Observable<Administrativo[]> {
    return this.http.get<Administrativo[]>(
      `${this.url}/administrativo-get/${id}`
    );
  }

  getDocente(id: any): Observable<Docente[]> {
    return this.http.get<Docente[]>(`${this.url}/docente-get/${id}`);
  }

  obtenerPersonaPorPerCodigo(codigo: number): Observable<Persona[]> {
    return this.http.get<Persona[]>(
      `${this.url}/obtener-persona-codigo/${codigo}`
    );
  }

  obtenerPersonaPorIdentificacion(id: String): Observable<Persona[]> {
    return this.http.get<Persona[]>(
      `${this.url}/obtener-persona-identificacion/${id}`
    );
  }

  getTerceroId(id: String): Observable<Tercero[]> {
    return this.http.get<Tercero[]>(`${this.url}/obtener-tercero/${id}`);
  }

  obtenerTickets(tipoTicket: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.url}/obtener-tickets/${tipoTicket}`);
  }

  obtenerTicketTerCodigo(
    codigo: number,
    tipoTicket: number
  ): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(
      `${this.url}/obtener-ticket-tercodigo/${codigo}/${tipoTicket}`
    );
  }

  obtenerTicketPerCodigo(
    codigo: number,
    tipoTicket: number
  ): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(
      `${this.url}/obtener-ticket-percodigo/${codigo}/${tipoTicket}`
    );
  }

  obtenerTicketIdentificacion(identificacion: String): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(
      `${this.url}/obtener-ticket-identificacion/${identificacion}`
    );
  }

  obtenerPoliticaPorCodigoEstamento(
    codigo: number
  ): Observable<PoliticaEstamento[]> {
    return this.http.get<PoliticaEstamento[]>(
      `${this.url}/obtener-politicaPorCodigoEstamento/${codigo}`
    );
  }

  mirarFoto(perCodigo: String): Observable<any> {
    return this.http.get<any>(
      `${this.url}/obtener-foto/a1075303330/${perCodigo}`,
      {
        responseType: 'blob' as 'json',
      }
    );
  }

  mirarFotoAntigua(perCodigo: String): Observable<Foto> {
    return this.http.get<Foto>(
      `${this.url}/obtener-foto-antigua/a1075303330/${perCodigo}`
    );
  }
}
