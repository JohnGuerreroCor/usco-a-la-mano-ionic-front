import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FotoService } from 'src/app/services/foto.service';
import { PersonaService } from 'src/app/services/persona.service';
import { EstamentoService } from 'src/app/services/estamento.service';
import { PoliticaEstamento } from './../../../models/politica-estamento';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CarnetDigital } from 'src/app/models/carnet-digital';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { Estudiante } from 'src/app/models/estudiante';
import { AuthService } from 'src/app/services/auth.service';
import { PoliticaService } from 'src/app/services/politica.service';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css'],
  providers: [DatePipe],
})
export class EstudianteComponent implements OnInit {
  public perCodigo: any = this.auth.user.personaCodigo;
  public perCodigoAntigua: any = '' + this.auth.user.personaCodigo;
  public nombre: any = this.auth.user.personaNombre;
  public apellido: any = this.auth.user.personaApellido;

  qrEncriptado!: string;

  //Booleanos
  cargaFoto: boolean = false;
  mobile: boolean = false;
  flipped: boolean = false;
  tipoQr: number = 0;

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
    private auth: AuthService,
    private router: Router,
    private datePipe: DatePipe,
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
    this.mostrarFoto(this.auth.user.personaCodigo.toString());
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
    //this.buscarFirmaActiva();
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
            this.estServices
              .getEstudiante(this.codigoEstudiante)
              .subscribe((data) => {
                if (JSON.stringify(data) !== '[]') {
                  this.estudiante = data;
                  this.mostrarFoto('' + this.estudiante[0].persona.codigo);
                  const param1 = '2';
                  const param2 = '' + this.estudiante[0].codigo;
                  /* const encryptedParams = this.encryptParams(param1, param2); */
                  /* let qr = encryptedParams.replace('=', 'igual'); */
                  //this.codigoQr = 'http://localhost:4200/#/publico;key=' + qr;
                  /* this.codigoQr =
                    'https://gaitana.usco.edu.co/carnet_digital/#/publico;key=' +
                    qr; */
                } else {
                  this.estudiante = [];
                  this.codigoQr = 'Sin resultado';
                  /* Swal.fire({
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

  flipCard(tipo: any) {
    this.flipped = !this.flipped;
    this.tipoQr = tipo;
  }

 /*  encryptParams(param1: string, param2: string): string {
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
 */
  /* decryptParams(encryptedParams: string): { param1: string; param2: string } {
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
  } */

/*   decifrar() {
    let url = this.codigoQr.replace(environment.URL_BACKEND, '');
    let qr = url.replace('igual', '=');
    const decryptedParams = this.decryptParams(qr);
  } */

  scrollToSection(page: HTMLElement) {
    page.scrollIntoView({ behavior: 'smooth' });
  }

  /* buscarFirmaActiva() {
    this.firmaService.obtenerFirmaActiva().subscribe((data) => {
      if (JSON.stringify(data) !== '[]') {
        this.rector = data;
        //this.obtenerFirma(+data[0].ruta);
      }
    });
  } */

  /* obtenerFirma(ruta: number) {
    this.firmaService.mirarFirma(ruta).subscribe((data) => {
      var blob = new Blob([data], { type: 'image/png' });
      const foto = blob;
      const reader = new FileReader();
      reader.onload = () => {
        this.firma.url = reader.result as string;
      };
      reader.readAsDataURL(foto);
    });
  } */

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
