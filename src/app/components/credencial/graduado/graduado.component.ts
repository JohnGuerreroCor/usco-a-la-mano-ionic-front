import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FotoService } from 'src/app/services/foto.service';
import { PersonaService } from 'src/app/services/persona.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PoliticaEstamento } from 'src/app/models/politica-estamento';
import { PoliticaService } from 'src/app/services/politica.service';
import { Persona } from 'src/app/models/persona';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { GraduadoService } from 'src/app/services/graduado.service';
import { Graduado } from 'src/app/models/graduado';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-graduado',
  templateUrl: './graduado.component.html',
  styleUrls: ['./graduado.component.css'],
  providers: [DatePipe],
})
export class GraduadoComponent implements OnInit {
  public perCodigo: any = this.auth.user.personaCodigo;

  //Booleanos
  alert: boolean = true;
  cargaFoto: boolean = false;
  flipped: boolean = false;
  tipoQr: number = 0;

  //Objetos
  graduado: Graduado[] = [];
  politicaEgresados: PoliticaEstamento[] = [];
  persona: Persona[] = [];

  //Complementos
  resizeObservable!: Observable<Event>;
  resizeSubscription!: Subscription;
  vistaMobile: String = '';

  codigoQr: any = null;
  busqueda!: String;
  url: string = environment.URL_BACKEND;
  nameFile = 'Seleccione la foto a cargar...';
  file!: FileList;
  foto: any = {
    url: '',
  };

  constructor(
    public graduadoService: GraduadoService,
    public fotoService: FotoService,
    public politicaService: PoliticaService,
    public personaService: PersonaService,
    private datePipe: DatePipe,
    private auth: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngAfterViewInit(): void {
    // Encuentra el botón usando la clase .Btn
    const buttonM = this.el.nativeElement.querySelector('.Btn-molinete');
    const buttonC = this.el.nativeElement.querySelector('.Btn-convenio');
    const buttonR = this.el.nativeElement.querySelector('.Btn-regresar');

    // Agrega la clase 'hover' después de un ligero retraso para activar la animación
    setTimeout(() => {
      this.renderer.addClass(buttonM, 'hover');
    }, 100); // Pequeño retraso para que la animación comience

    // Remueve la clase 'hover' después de 10 segundos
    setTimeout(() => {
      this.renderer.removeClass(buttonM, 'hover');
    }, 3100); // 100ms de retraso inicial + 10000ms (10 segundos)

    // Agrega la clase 'hover' después de un ligero retraso para activar la animación
    setTimeout(() => {
      this.renderer.addClass(buttonC, 'hover');
    }, 200); // Pequeño retraso para que la animación comience

    // Remueve la clase 'hover' después de 10 segundos
    setTimeout(() => {
      this.renderer.removeClass(buttonC, 'hover');
    }, 3200); // 100ms de retraso inicial + 10000ms (10 segundos)
    // Agrega la clase 'hover' después de un ligero retraso para activar la animación
    setTimeout(() => {
      this.renderer.addClass(buttonR, 'hover');
    }, 300); // Pequeño retraso para que la animación comience

    // Remueve la clase 'hover' después de 10 segundos
    setTimeout(() => {
      this.renderer.removeClass(buttonR, 'hover');
    }, 3300); // 100ms de retraso inicial + 10000ms (10 segundos)
  }

  ngOnInit() {
    this.vistaMobile = '' + window.screen.width;
    this.personaService
      .obtenerPersonaPorPerCodigo(this.perCodigo)
      .subscribe((data) => {
        this.persona = data;
        this.graduadoService
          .obtenerGraduado(this.persona[0].identificacion)
          .subscribe((data) => {
            if (JSON.stringify(data) !== '[]') {
              this.graduado = data;
              const param1 = '4';
              const param2 = '' + this.graduado[0].persona.identificacion;
              const encryptedParams = this.encryptParams(param1, param2);
              let qr = encryptedParams.replace('=', 'igual');
              /* this.codigoQr = 'http://localhost:4200/#/publico;key=' + qr; */
              this.codigoQr =
                'https://gaitana.usco.edu.co/carnet_digital/#/publico;key=' +
                qr;
              this.mostrarFoto('' + this.graduado[0].persona.codigo);
            } else {
              this.graduado = [];
            }
          });
      });

    this.buscarPoliticaEstamento();
  }

  flipCard(tipo: any) {
    this.flipped = !this.flipped;
    this.tipoQr = tipo;
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

  scrollToSection(page: HTMLElement) {
    page.scrollIntoView({ behavior: 'smooth' });
  }

  buscarPoliticaEstamento() {
    this.politicaService
      .obtenerPoliticaPorCodigoEstamento(4)
      .subscribe((data) => {
        this.politicaEgresados = data;
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
          .mirarFotoAntigua('' + this.graduado[0].persona.codigo)
          .subscribe((data) => {
            this.foto = data;
          });
      }
    });
  }
}
