import { Component, OnInit } from '@angular/core';
import { PoliticaEstamento } from 'src/app/models/politica-estamento';
import { PublicoService } from 'src/app/services/publico.service';
import { Administrativo } from 'src/app/models/administrativo';
import { CarnetDigital } from 'src/app/models/carnet-digital';
import { environment } from 'src/environments/environment';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Estudiante } from 'src/app/models/estudiante';
import { Graduado } from 'src/app/models/graduado';
import { ActivatedRoute } from '@angular/router';
import { Docente } from 'src/app/models/docente';
import { Persona } from 'src/app/models/persona';
import { Ticket } from 'src/app/models/ticket';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-publico',
  templateUrl: './publico.component.html',
  styleUrls: ['./publico.component.css'],
  providers: [DatePipe],
})
export class PublicoComponent implements OnInit {
  //Booleanos
  cargaFoto: boolean = false;
  mobile: boolean = false;
  flipped: boolean = false;

  carnetEstudiante: boolean = true;
  carnetGraduado: boolean = false;
  carnetAdministrativo: boolean = false;
  carnetDocente: boolean = false;
  tiquete: boolean = false;

  //Objetos
  carnet: CarnetDigital[] = [];
  politica: PoliticaEstamento[] = [];

  estudiante: Estudiante[] = [];
  graduado: Graduado[] = [];
  docente: Docente[] = [];
  administrativo: Administrativo[] = [];
  persona: Persona[] = [];
  ticket: Ticket[] = [];

  //Complementos
  tipoTiquete: number = 2;
  anio = new Date();
  hash: any;
  resizeObservable!: Observable<Event>;
  resizeSubscription!: Subscription;
  vistaMobile: String = '';

  codigoEstudiante!: any;
  busqueda!: any;
  url: any = environment.URL_BACKEND;
  nameFile = 'Seleccione la foto a cargar...';
  file!: FileList;
  foto: any = {
    url: '',
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    public publicoService: PublicoService,
    private datePipe: DatePipe
  ) {}

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
    this.loadToken();
  }

  flipCard() {
    this.flipped = !this.flipped;
  }

  loadToken() {
    this.activatedRoute.params.subscribe((params) => {
      let key = params['key'];
      this.decifrar(key);
    });
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

  decifrar(key: String) {
    const [parm1, parm2] = key.split(',');
    let val1 = this.reemplazarIgual(parm1);
    val1 = this.reemplazarUsco(val1);
    let val2 = this.reemplazarIgual(parm2);
    val2 = this.reemplazarUsco(val2);
    let qr = val1 + ',' + val2;
    const decryptedParams = this.decryptParams(qr);
    this.buscar(+decryptedParams.param1, decryptedParams.param2);
  }

  reemplazarUsco(input: string): string {
    const regex = new RegExp('usco', 'gi');
    const replacedInput = input.replace(regex, '/');

    return replacedInput;
  }

  reemplazarIgual(input: string): string {
    const regex = new RegExp('igual', 'gi');
    const replacedInput = input.replace(regex, '=');

    return replacedInput;
  }

  buscar(estamento: number, codigo: String) {
    switch (estamento) {
      case 1: //ADMINISTRATIVO
        //this.buscarPoliticaEstamento(1);
        this.foto.url = '';
        this.carnetEstudiante = false;
        this.carnetGraduado = false;
        this.carnetDocente = false;
        this.carnetAdministrativo = true;
        this.tiquete = false;
        this.buscarAdministrativo(codigo);
        break;
      case 2: //ESTUDIANTE
        //this.buscarPoliticaEstamento(2);
        this.foto.url = '';
        this.carnetEstudiante = true;
        this.carnetGraduado = false;
        this.carnetDocente = false;
        this.carnetAdministrativo = false;
        this.tiquete = false;
        this.buscarEstudiante(codigo);
        break;
      case 3: //DOCENTE
        //this.buscarPoliticaEstamento(3);
        this.foto.url = '';
        this.carnetEstudiante = false;
        this.carnetGraduado = false;
        this.carnetDocente = true;
        this.carnetAdministrativo = false;
        this.tiquete = false;
        this.buscarDocente(codigo);
        break;
      case 4: //GRADUADO
        //this.buscarPoliticaEstamento(4);
        this.foto.url = '';
        this.carnetEstudiante = false;
        this.carnetGraduado = true;
        this.carnetDocente = false;
        this.carnetAdministrativo = false;
        this.tiquete = false;
        this.buscarGraduado(codigo);
        break;
      case 7: //TIQUETE
        this.foto.url = '-';
        this.tiquete = true;
        this.carnetEstudiante = false;
        this.carnetGraduado = false;
        this.carnetDocente = false;
        this.carnetAdministrativo = false;
        this.buscarTiquete(codigo);
        break;
      default:
        this.foto.url = '';
        /* Swal.fire({
          icon: 'error',
          title: 'QR Desconocido',
          text: 'El código escaneado no posee los parametros correspondientes.',
          confirmButtonColor: '#8f141b',
          confirmButtonText: 'Listo',
        }); */
        break;
    }
  }

  buscarEstudiante(codigo: String) {
    this.publicoService.getEstudiante(codigo).subscribe((data) => {
      if (JSON.stringify(data) !== '[]') {
        this.estudiante = data;

        this.mostrarFotoEstudiante('' + this.estudiante[0].persona.codigo);
      } else {
        this.foto.url = '';
        this.estudiante = [];
        /* Swal.fire({
          icon: 'warning',
          title: 'No existe',
          text: 'El código digitado no encontró ningún Estudiante asociado, por favor rectifique el código.',
          confirmButtonColor: '#8f141b',
        }); */
      }
    });
  }

  buscarGraduado(codigo: String) {
    this.publicoService.obtenerGraduado(codigo).subscribe((data) => {
      if (JSON.stringify(data) !== '[]') {
        this.graduado = data;

        this.mostrarFotoGraduado('' + this.graduado[0].persona.codigo);
      } else {
        this.foto.url = '';
        this.graduado = [];
        /* Swal.fire({
          icon: 'warning',
          title: 'No existe',
          text: 'El código no encontró ningún Graduado asociado, por favor rectifique el código.',
          confirmButtonColor: '#8f141b',
        }); */
      }
    });
  }

  buscarDocente(id: String) {
    this.publicoService.getDocente(id).subscribe((data) => {
      if (JSON.stringify(data) !== '[]') {
        this.docente = data;
        this.mostrarFotoDocente('' + this.docente[0].persona.codigo);
      } else {
        this.foto.url = '';
        this.docente = [];
        /* Swal.fire({
          icon: 'warning',
          title: 'No existe',
          text: 'El código no encontró ningún Docente asociado, por favor rectifique el código.',
          confirmButtonColor: '#8f141b',
        }); */
      }
    });
  }

  buscarAdministrativo(id: String) {
    this.publicoService.getAdministrativo(id).subscribe((data) => {
      if (JSON.stringify(data) !== '[]') {
        this.administrativo = data;
        const index = this.administrativo.findIndex(
          (admin) => admin.cargoNombre === 'DOCENTE'
        );
        if (index !== -1) {
          this.administrativo.splice(index, 1);
        }
        this.publicoService
          .obtenerPersonaPorPerCodigo(data[0].codigo)
          .subscribe((data) => {
            this.persona = data;
            this.mostrarFotoAdministrativo('' + this.persona[0].codigo);
          });
      } else {
        this.foto.url = '';
        /* Swal.fire({
          icon: 'warning',
          title: 'No existe',
          text: 'El código no encontró ningún Administrativo asociado, por favor rectifique el código.',
          confirmButtonColor: '#8f141b',
        }); */
        this.administrativo = [];
      }
    });
  }

  buscarTiquete(id: String) {
    this.publicoService.obtenerTicketIdentificacion(id).subscribe((data) => {
      if (JSON.stringify(data) !== '[]') {
        let fecha1: any = this.datePipe.transform(
          data[0].fechaVigencia,
          'yyyy-MM-dd'
        );
        let fecha2: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        if (fecha1 >= fecha2) {
          this.ticket = data;
          this.tipoTiquete = data[0].tipo;
        } else {
          this.foto.url = '';
          /* Swal.fire({
            icon: 'warning',
            title: 'No existe o expiró el tiquete',
            text: 'El código no encontró ningún Tiquete vigente o asociado, por favor rectifique el código.',
            confirmButtonColor: '#8f141b',
          }); */
          this.ticket = [];
        }
      } else {
        this.foto.url = '';
        /* Swal.fire({
          icon: 'warning',
          title: 'No existe o expiró el tiquete',
          text: 'El código no encontró ningún Tiquete vigente o asociado, por favor rectifique el código.',
          confirmButtonColor: '#8f141b',
        }); */
        this.ticket = [];
      }
    });
  }

  mostrarFotoEstudiante(perCodigo: String) {
    this.publicoService.mirarFoto(perCodigo).subscribe((data) => {
      var gg = new Blob([data], { type: 'application/json' });
      if (gg.size !== 4) {
        var blob = new Blob([data], { type: 'image/png' });
        const foto = blob;
        const reader = new FileReader();
        reader.onload = () => {
          this.foto.url = reader.result as string;
          if (this.foto.url != '') {
          }
        };
        reader.readAsDataURL(foto);
      } else {
        this.publicoService
          .mirarFotoAntigua('' + this.estudiante[0].persona.codigo)
          .subscribe((data) => {
            this.foto = data;
          });
      }
    });
  }

  mostrarFotoAdministrativo(perCodigo: String) {
    this.publicoService.mirarFoto(perCodigo).subscribe((data) => {
      var gg = new Blob([data], { type: 'application/json' });
      if (gg.size !== 4) {
        var blob = new Blob([data], { type: 'image/png' });
        const foto = blob;
        const reader = new FileReader();
        reader.onload = () => {
          this.foto.url = reader.result as string;
          if (this.foto.url != '') {
          }
        };
        reader.readAsDataURL(foto);
      } else {
        this.publicoService
          .mirarFotoAntigua('' + this.persona[0].codigo)
          .subscribe((data) => {
            this.foto = data;
          });
      }
    });
  }

  mostrarFotoDocente(perCodigo: String) {
    this.publicoService.mirarFoto(perCodigo).subscribe((data) => {
      var gg = new Blob([data], { type: 'application/json' });
      if (gg.size !== 4) {
        var blob = new Blob([data], { type: 'image/png' });
        const foto = blob;
        const reader = new FileReader();
        reader.onload = () => {
          this.foto.url = reader.result as string;
          if (this.foto.url != '') {
          }
        };
        reader.readAsDataURL(foto);
      } else {
        this.publicoService
          .mirarFotoAntigua('' + this.docente[0].persona.codigo)
          .subscribe((data) => {
            this.foto = data;
          });
      }
    });
  }

  mostrarFotoGraduado(perCodigo: String) {
    this.publicoService.mirarFoto(perCodigo).subscribe((data) => {
      var gg = new Blob([data], { type: 'application/json' });
      if (gg.size !== 4) {
        var blob = new Blob([data], { type: 'image/png' });
        const foto = blob;
        const reader = new FileReader();
        reader.onload = () => {
          this.foto.url = reader.result as string;
          if (this.foto.url != '') {
          }
        };
        reader.readAsDataURL(foto);
      } else {
        this.publicoService
          .mirarFotoAntigua('' + this.graduado[0].persona.codigo)
          .subscribe((data) => {
            this.foto = data;
          });
      }
    });
  }
}
