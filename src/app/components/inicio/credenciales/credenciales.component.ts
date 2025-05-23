import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EstamentoService } from 'src/app/services/estamento.service';

@Component({
  selector: 'app-credenciales',
  templateUrl: './credenciales.component.html',
  styleUrls: ['./credenciales.component.css'],
})
export class CredencialesComponent implements OnInit {
  links: any[] = [];
  constructor(
    public auth: AuthService,
    private router: Router,
    public estamentoService: EstamentoService
  ) {}

  ngOnInit() {
    this.links = [];
    this.estamentoService
      .obtenerCarnets(this.auth.user.personaCodigo)
      .subscribe((data) => {
        for (let index = 0; index < data.length; index++) {
          switch (data[index].codigo) {
            case 1: //ADMINISTRATIVO
              if (data[index].tipoEstudiante === 0) {
                this.links.push({
                  titulo: 'Administrativo',
                  ruta: '/administrativo',
                  icono: 'fa-solid fa-user-tie fa-3x  color-icon',
                  info: 'Consulta, cambio de foto para los diferentes estamentos de la institución y aclaración de las dependencias que administran la información de cada estamento.',
                  descripcion:
                    'Identifícate como administrativo de la Universidad Surcolomiana',
                });
              }
              break;
            case 2: //ESTUDIANTE
              if (data[index].tipoEstudiante != 0) {
                this.links.push({
                  titulo: 'Estudiante',
                  ruta: '/estudiante',
                  icono: 'fa-solid fa-user fa-3x  color-icon',
                  info: 'Consulta, cambio de foto para los diferentes estamentos de la institución y aclaración de las dependencias que administran la información de cada estamento.',
                  descripcion:
                    'Identifícate como estudiante de la Universidad Surcolomiana',
                });
              }
              break;
            case 3: //DOCENTE
              this.links.push({
                titulo: 'Docente',
                ruta: '/docente',
                icono: 'fa-solid fa-chalkboard-user fa-3x  color-icon',
                info: 'Consulta, cambio de foto para los diferentes estamentos de la institución y aclaración de las dependencias que administran la información de cada estamento.',
                descripcion:
                  'Identifícate como docente de la Universidad Surcolomiana',
              });
              break;
            case 4: //GRADUADO
              this.links.push({
                titulo: 'Graduado',
                ruta: '/graduado',
                icono: 'fa-solid fa-graduation-cap fa-3x  color-icon',
                info: 'Consulta, cambio de foto para los diferentes estamentos de la institución y aclaración de las dependencias que administran la información de cada estamento.',
                descripcion:
                  'Identifícate como graduado de la Universidad Surcolomiana',
              });
              break;
            case 5: //VIRTUAL
              this.links.push({
                titulo: 'Est. Virtual',
                ruta: '/estudiante-virtual',
                icono: 'fa-solid fa-computer fa-3x  color-icon',
                info: 'Consulta, cambio de foto para los diferentes estamentos de la institución y aclaración de las dependencias que administran la información de cada estamento.',
                descripcion:
                  'Identifícate como estudiante virtual de la Universidad Surcolomiana',
              });
              break;
            case 6: //INTERCAMBIO
              this.links.push({
                titulo: 'Est. Intercambio',
                ruta: '/estudiante-intercambio',
                icono: 'fa-solid fa-earth-americas fa-3x  color-icon',
                info: 'Consulta, cambio de foto para los diferentes estamentos de la institución y aclaración de las dependencias que administran la información de cada estamento.',
                descripcion:
                  'Identifícate como estudiante de intercambio de la Universidad Surcolomiana',
              });
              break;
          }
        }
        this.isOddNumberOfLinks();
        /* this.carnets = data;
      for (let index = 0; index < this.carnets.length; index++) {
        switch (this.carnets[index].codigo) {
          case 1: //ADMINISTRATIVO
            this.carnetAdministrativo = true;
            break;
          case 2: //ESTUDIANTE
            this.carnetEstudiante = true;
            if (this.carnets[index].tipoEstudiante == 1) {
              this.servicioRestaurante = true;
              this.servicioAcademicoPregrado = true;
            } else {
              this.servicioRestaurante = false;
              this.servicioAcademicoPregrado = false;
            }
            break;
          case 3: //DOCENTE
            this.carnetDocente = true;
            break;
          case 4: //GRADUADO
            this.carnetGraduado = true;
            break;
          case 5: //VIRTUAL
            this.carnetVirtual = true;
            break;
          case 6: //INTERCAMBIO
            this.carnetIntercambio = true;
            break;
        }
      } */
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

  isLastImpar(index: number, length: number): boolean {
    return length % 2 !== 0 && index === length - 1;
  }
}
