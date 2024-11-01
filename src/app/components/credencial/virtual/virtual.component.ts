import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FotoService } from 'src/app/services/foto.service';
import { PersonaService } from 'src/app/services/persona.service';
import { EstamentoService } from 'src/app/services/estamento.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { Estudiante } from 'src/app/models/estudiante';
import { AuthService } from 'src/app/services/auth.service';
import { PoliticaService } from 'src/app/services/politica.service';
import { PoliticaEstamento } from 'src/app/models/politica-estamento';
import { CarnetDigital } from 'src/app/models/carnet-digital';

@Component({
  selector: 'app-virtual',
  templateUrl: './virtual.component.html',
  styleUrls: ['./virtual.component.css'],
})
export class VirtualComponent implements OnInit {
  public perCodigo: any = this.auth.user.personaCodigo;
  public perCodigoAntigua: any = '' + this.auth.user.personaCodigo;
  public nombre: any = this.auth.user.personaNombre;
  public apellido: any = this.auth.user.personaApellido;

  //Booleanos
  cargaFoto: boolean = false;
  mobile: boolean = false;
  flipped: boolean = false;

  //Objetos
  estudiante: Estudiante[] = [];
  carnet: CarnetDigital[] = [];
  politicaEstudiante: PoliticaEstamento[] = [];

  //Complementos
  resizeObservable!: Observable<Event>;
  resizeSubscription!: Subscription;
  vistaMobile: String = '';

  codigoEstudiante!: String;
  codigoQr: any = null;
  busqueda!: String;
  url: string = environment.URL_BACKEND;

  foto: any = {
    url: '',
  };

  constructor(
    public estServices: EstudianteService,
    public fotoService: FotoService,
    public politicaService: PoliticaService,
    public estamentoService: EstamentoService,
    public personaService: PersonaService,
    private auth: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.codigoQr = 'https://www.usco.edu.co/';
  }

  flipCard() {
    this.flipped = !this.flipped;
  }

  ngOnInit() {
    if (window.screen.width <= 950) {
      // 768px portrait
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe((evt) => {
      if (window.screen.width <= 950) {
        // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    });
    this.vistaMobile = '' + window.screen.width;

    this.buscarPoliticaEstamento();
    let codigo = this.auth.user.username.split('u');
    this.estamentoService
      .obtenerCarnetEstamento(this.perCodigo)
      .subscribe((data) => {
        this.carnet = data;
        for (let index = 0; index < this.carnet.length; index++) {
          if (this.carnet[index].codigo === 5) {
            this.estServices
              .buscarEstudianteIdentifiacion(this.carnet[index].usuario)
              .subscribe((data) => {
                if (JSON.stringify(data) !== '[]') {
                  this.estudiante = data;
                  this.mostrarFoto('' + this.estudiante[0].persona.codigo);
                  const param1 = '5';
                  const param2 = '' + this.estudiante[0].codigo;
                  const encryptedParams = this.encryptParams(param1, param2);
                  let qr = encryptedParams.replace('=', 'igual');
                  //this.codigoQr = 'http://localhost:4200/#/publico;key=' + qr;
                  this.codigoQr =
                    'https://gaitana.usco.edu.co/carnet_digital/#/publico;key=' +
                    qr;
                } else {
                  this.estudiante = [];
                  this.codigoQr = 'Sin resultado';
                }
              });
          }
        }
      });
  }

  scrollToSection(page: HTMLElement) {
    page.scrollIntoView({ behavior: 'smooth' });
  }

  encryptParams(param1: string, param2: string): string {
    const currentDate: any = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    let fecha = currentDate.toString();
    const encryptedParam1 = CryptoJS.AES.encrypt(param1, fecha).toString();
    let parm1 = encryptedParam1.replace(/=/g, 'igual');
    parm1 = parm1.replace(/\//g, 'usco');
    const encryptedParam2 = CryptoJS.AES.encrypt(param2, fecha).toString();
    let parm2 = encryptedParam2.replace(/=/g, 'igual');
    parm2 = parm2.replace(/\//g, 'usco');

    // Concatenar los parámetros encriptados y retornarlos
    return parm1 + ',' + parm2;
  }

  decryptParams(encryptedParams: string): { param1: string; param2: string } {
    const currentDate: any = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    let fecha = currentDate.toString();
    const [encryptedParam1, encryptedParam2] = encryptedParams.split(',');
    const decryptedParam1 = CryptoJS.AES.decrypt(
      encryptedParam1,
      fecha
    ).toString(CryptoJS.enc.Utf8);
    const decryptedParam2 = CryptoJS.AES.decrypt(
      encryptedParam2,
      fecha
    ).toString(CryptoJS.enc.Utf8);
    return { param1: decryptedParam1, param2: decryptedParam2 };
  }

  buscarPoliticaEstamento() {
    this.politicaService
      .obtenerPoliticaPorCodigoEstamento(2)
      .subscribe((data) => {
        this.politicaEstudiante = data;
      });
  }

  mostrarFoto(perCodigo: String) {
    this.fotoService.mirarFoto(perCodigo).subscribe((data) => {
      var gg = new Blob([data], { type: 'application/json' });
      if (gg.size !== 4) {
        var blob = new Blob([data], { type: 'image/png' });
        const foto = blob;
        const reader = new FileReader();
        reader.onload = () => {
          this.foto.url = reader.result as string;
        };
        reader.readAsDataURL(foto);
      } else {
        this.fotoService
          .mirarFotoAntigua('' + this.estudiante[0].persona.codigo)
          .subscribe((data) => {
            this.foto = data;
          });
      }
    });
  }
}
