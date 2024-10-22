import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Estamento } from '../models/estamento';
import { CarnetDigital } from '../models/carnet-digital';

@Injectable({
  providedIn: 'root',
})
export class EstamentoService {
  private url: string = `${environment.URL_BACKEND}/estamentos`;
  private httpHeaders = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private authservice: AuthService,
    private router: Router
  ) {}
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e: { status: number }): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  find(): Observable<Estamento[]> {
    return this.http.get<Estamento[]>(`${this.url}/find`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  obtenerCarnets(percodigo: number): Observable<Estamento[]> {
    return this.http
      .get<Estamento[]>(`${this.url}/carnets/${percodigo}`, {
        headers: this.aggAutorizacionHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerCarnetEstamento(percodigo: number): Observable<CarnetDigital[]> {
    return this.http.get<CarnetDigital[]>(
      `${this.url}/carnet-estamento/${percodigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
