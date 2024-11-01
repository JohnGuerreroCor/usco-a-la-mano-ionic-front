import { Component, OnInit } from '@angular/core';
import { EstudianteService } from '../../services/estudiante.service';
import { environment } from 'src/environments/environment';
import { Estudiante } from '../../models/estudiante';
import { FotoService } from 'src/app/services/foto.service';
import { AuthService } from '../../services/auth.service';
import { PoliticaService } from '../../services/politica.service';
import { PoliticaEstamento } from '../../models/politica-estamento';
import { PersonaService } from 'src/app/services/persona.service';
import { EstamentoService } from 'src/app/services/estamento.service';
import { CarnetDigital } from '../../models/carnet-digital';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.css'],
  providers: [DatePipe],
})
export class BibliotecaComponent implements OnInit {
  hora!: string;
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
    private auth: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  flipCard() {
    this.flipped = !this.flipped;
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

  ngOnInit() {
    this.mostrarFoto(this.auth.user.personaCodigo.toString());

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
                  this.mostrarFoto('' + this.estudiante[0].persona.codigo);
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
          .mirarFotoAntigua('' + this.auth.user.personaCodigo)
          .subscribe((data) => {
            this.foto = data;
          });
      }
    });
  }
}
