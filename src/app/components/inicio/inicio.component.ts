import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EstamentoService } from 'src/app/services/estamento.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  links: any[] = [];
  constructor(
    public auth: AuthService,
    public estamentoService: EstamentoService
  ) {}

  ngOnInit() {
    this.links = [
      {
        titulo: 'Credencial',
        ruta: '/credenciales',
        icono: 'fa-solid fa-id-card fa-6x p-4 ion-text-center color-icon',
      },
    ];
    this.estamentoService
      .obtenerCarnets(this.auth.user.personaCodigo)
      .subscribe((data) => {
        for (let index = 0; index < data.length; index++) {
          switch (data[index].codigo) {
            case 2: //ESTUDIANTE
              if (data[index].tipoEstudiante == 1) {
                this.links.push(
                  {
                    titulo: 'Academico E.',
                    ruta: '/academico-estudiante/matricula',
                    icono:
                      'fa-solid fa-building-columns fa-6x p-4 ion-text-center color-icon',
                  },
                  {
                    titulo: 'Restaurante',
                    ruta: '/restaurante/ventanilla',
                    icono:
                      'fa-solid fa-utensils fa-6x p-4 ion-text-center color-icon',
                  },
                  {
                    titulo: 'Biblioteca',
                    ruta: '/biblioteca',
                    icono:
                      'fa-solid fa-book fa-6x p-4 ion-text-center color-icon',
                  }
                );
              }
              break;
            case 3: //DOCENTE
              this.links.push({
                titulo: 'Academico D.',
                ruta: '/academico-docente/carga-academica',
                icono:
                  'fa-solid fa-building-columns fa-6x p-4 ion-text-center color-icon',
              });
              break;
            case 6: //INTERCAMBIO
              this.links.push(
                {
                  titulo: 'Academico E.',
                  ruta: '/academico-estudiante/matricula',
                  icono:
                    'fa-solid fa-building-columns fa-6x p-4 ion-text-center color-icon',
                },
                {
                  titulo: 'Restaurante',
                  ruta: '/restaurante/ventanilla',
                  icono:
                    'fa-solid fa-utensils fa-6x p-4 ion-text-center color-icon',
                },
                {
                  titulo: 'Biblioteca',
                  ruta: '/biblioteca',
                  icono:
                    'fa-solid fa-book fa-6x p-4 ion-text-center color-icon',
                }
              );
              break;
          }
        }
        this.isOddNumberOfLinks();
      });
  }
  informacion() {
    /* const horaInicioFormateada = formatDate(
      this.horaInicioSesion,
      'dd-MM-yyyy, h:mm a',
      'en-US'
    );
    const horaFinFormateada = formatDate(
      this.horaFinSesion,
      'dd-MM-yyyy, h:mm a',
      'en-US'
    );

    Swal.fire({
      title: 'Información de inicio de sesión',
      html: ` 
        <hr style="border-bottom: dashed 1px #222d32;" />      
        <small><b>HORA INICIO SESIÓN: </b><br /> ${horaInicioFormateada} </small>      
        <hr style="border-bottom: dashed 1px #222d32;" />        
        <small><b>HORA FINALIZACIÓN: </b><br /> ${horaFinFormateada} </small>
        <hr style="border-bottom: dashed 1px #222d32;" />    
      `,
      showConfirmButton: true,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#8f141b',
    }); */
  }
  isOddNumberOfLinks(): boolean {
    return this.links.length % 2 !== 0;
  }
}
