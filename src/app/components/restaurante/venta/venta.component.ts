import { Component } from '@angular/core';
import { RestauranteService } from './../../../services/restaurante.service';
import { RestauranteRaciones } from 'src/app/models/restaurante-raciones';
import { RestauranteSedes } from 'src/app/models/restaurante-sedes';
import { RestauranteTiquetes } from 'src/app/models/restaurante-tiquetes';

import { EstudianteService } from '../../../services/estudiante.service';
import { environment } from 'src/environments/environment';
import { Estudiante } from '../../../models/estudiante';
import { FotoService } from 'src/app/services/foto.service';
import { AuthService } from '../../../services/auth.service';
import { PoliticaService } from '../../../services/politica.service';
import { PoliticaEstamento } from '../../../models/politica-estamento';
import { PersonaService } from 'src/app/services/persona.service';
import { EstamentoService } from 'src/app/services/estamento.service';
import { CarnetDigital } from '../../../models/carnet-digital';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { RestauranteVenta } from 'src/app/models/restaurante-venta';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  providers: [DatePipe],
})
export class VentaComponent {
  hora!: string;
  cifraInicial: number = 400; // Puedes ajustar esta cifra según tus necesidades
  intervalo: any;
  raciones: RestauranteRaciones[] = [];
  tiquetes: RestauranteTiquetes[] = [];
  sedes: RestauranteSedes[] = [];
  sede: any;
  flipped: boolean = false;

  public perCodigo: any = this.auth.user.personaCodigo;
  public perCodigoAntigua: any = '' + this.auth.user.personaCodigo;
  public nombre: any = this.auth.user.personaNombre;
  public apellido: any = this.auth.user.personaApellido;

  qrEncriptado!: string;

  //Booleanos
  cargaFoto: boolean = false;
  mobile: boolean = false;

  //Objetos
  estudiante: Estudiante[] = [];
  carnet: CarnetDigital[] = [];
  politicaEstudiante: PoliticaEstamento[] = [];
  boletas: RestauranteVenta[] = [];

  //Complementos
  resizeObservable!: Observable<Event>;
  resizeSubscription!: Subscription;
  vistaMobile: String = '';
  tipoQr: number = 0;
  codigoBarras: any;

  codigoEstudiante!: String;
  codigoQr: any = null;
  codigoQrOnlinePc: any = null;
  codigoQrOnlineMobile: any = null;
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
    public encriptadoService: EncriptadoService,
    public restauranteService: RestauranteService,
    private auth: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  flipCard() {
    this.flipped = !this.flipped;
  }

  obtenerRacionesSedes() {
    this.raciones = [];
    this.restauranteService
      .obtenerRacionesDisponibles(this.sede)
      .subscribe((data) => {
        this.raciones = data;
      });
  }

  obtenerTiquetesSedes() {
    this.tiquetes = [];
    this.restauranteService
      .obtenerTiquetesDisponibles(this.sede)
      .subscribe((data) => {
        if (JSON.stringify(data) != '[]') {
          this.tiquetes = data;
        }
      });
  }

  private actualizarHora() {
    const ahora = new Date();
    this.hora = `${this.agregarCero(ahora.getHours())}:${this.agregarCero(
      ahora.getMinutes()
    )}:${this.agregarCero(ahora.getSeconds())}`;
  }

  private agregarCero(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  obtenerQrEncriptado() {
    this.encriptadoService
      .obtenerQrEncriptado(this.auth.user.personaCodigo.toString())
      .subscribe((data) => {
        let cadenaReemplazada: string = data.replace(/\+/g, '-');
        this.qrEncriptado =
          'https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=' +
          cadenaReemplazada.trim();
      });
  }

  obtenerBoletos() {
    this.restauranteService
      .obtenerBoletos(this.auth.user.personaCodigo)
      .subscribe((data) => {
        if (JSON.stringify(data) != '[]') {
          this.boletas = data;
          this.obtenerQrEncriptado();
        } else {
          this.boletas = [];
        }
      });
  }

  ngOnInit() {
    this.restauranteService.obtenerSedesRestaurante().subscribe((data) => {
      this.sedes = data;
    });
    this.actualizarHora();
    setInterval(() => this.actualizarHora(), 1000); // Actualizar cada segundo
    //this.actualizarCifra();
    //this.intervalo = setInterval(() => this.decrementarCifra(), 5000); // Decrementar cada 5 segundos */
    this.obtenerBoletos();
    this.mostrarFoto();
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
    this.estamentoService
      .obtenerCarnetEstamento(this.perCodigo)
      .subscribe((data) => {
        this.carnet = data;
        for (let index = 0; index < this.carnet.length; index++) {
          if (
            this.carnet[index].codigo === 2 &&
            JSON.stringify(this.codigoEstudiante) == undefined &&
            this.perCodigo
          ) {
            let aux = this.auth.user.username.split('u');
            this.codigoEstudiante = aux[1].trim();
            this.codigoBarras =
              'https://barcode.tec-it.com/barcode.ashx?data=' +
              this.codigoEstudiante +
              '&code=Code128&translate-esc=on&unit=Fit&imagetype=Jpg&color=4d626c&showhrt=no&modulewidth=0.265';
            this.estServices
              .getEstudiante(this.codigoEstudiante)
              .subscribe((data) => {
                if (JSON.stringify(data) !== '[]') {
                  this.estudiante = data;
                  this.mostrarFoto();
                  const param1 = '2';
                  const param2 = '' + this.estudiante[0].codigo;
                  const encryptedParams = this.encryptParams(param1, param2);
                  let qr = encryptedParams.replace('=', 'igual');
                  //this.codigoQr = 'http://localhost:4200/#/publico;key=' + qr;
                  this.codigoQr =
                    'https://gaitana.usco.edu.co/carnet_digital/#/publico;key=' +
                    qr;
                } else {
                  this.estudiante = [];
                  //this.codigoQr = 'Sin resultado';
                  /*  Swal.fire({
                    icon: 'warning',
                    title: 'No existe',
                    text: 'El código digitado no encontró ningún Estudiante asociado, por favor rectifique el código.',
                  }); */
                }
              });
          }
        }
      });
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

  decifrar() {
    let url = this.codigoQr.replace(environment.URL_BACKEND, '');
    let qr = url.replace('igual', '=');
    const decryptedParams = this.decryptParams(qr);
  }

  scrollToSection(page: HTMLElement) {
    page.scrollIntoView({ behavior: 'smooth' });
  }

  buscarPoliticaEstamento() {
    this.politicaService
      .obtenerPoliticaPorCodigoEstamento(2)
      .subscribe((data) => {
        this.politicaEstudiante = data;
      });
  }

  mostrarFoto() {
    this.fotoService
      .mirarFoto('' + this.auth.user.personaCodigo)
      .subscribe((data) => {
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
            .mirarFotoAntigua('' + this.auth.user.personaCodigo)
            .subscribe((data) => {
              this.foto = data;
            });
        }
      });
  }
}
