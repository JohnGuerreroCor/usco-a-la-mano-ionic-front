import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Foto } from './models/foto';
import { FotoService } from './services/foto.service';
import { EstamentoService } from './services/estamento.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  links: any[] = [];
  isAuthenticated = false;
  title = 'plantilla-ionic-web';
  foto: Foto = {
    url: '',
  };
  subMenus: any = {
    inicio: false,
    carnet: false,
    restaurante: false,
  };

  constructor(
    public auth: AuthService,
    private router: Router,
    public fotoService: FotoService,
    private cdr: ChangeDetectorRef,
    public estamentoService: EstamentoService
  ) {}

  ngOnInit() {
    this.links = [
      {
        titulo: 'Credencial',
        ruta: '/credenciales',
        icono: 'fa-solid fa-id-card',
        info: 'Consulta, cambio de foto para los diferentes estamentos de la institución y aclaración de las dependencias que administran la información de cada estamento.',
      },
    ];
    this.auth.authStatus.subscribe((status) => {
      this.isAuthenticated = status;
      console.log('Autenticado:', this.isAuthenticated); // Para depurar
      this.cdr.detectChanges(); // Forzar la detección de cambios
      if (this.isAuthenticated) {
        this.obtenerFoto(); // Cargar foto solo si está autenticado
        this.estamentoService
          .obtenerCarnets(this.auth.user.personaCodigo)
          .subscribe((data) => {
            console.log(data);
            for (let index = 0; index < data.length; index++) {
              switch (data[index].codigo) {
                case 2: //ESTUDIANTE
                  if (data[index].tipoEstudiante == 1) {
                    this.links.push(
                      {
                        titulo: 'Academico E.',
                        ruta: '/carnet',
                        icono: 'fa-solid fa-building-columns',
                        info: 'Consulta, cambio de foto para los diferentes estamentos de la institución y aclaración de las dependencias que administran la información de cada estamento.',
                      },
                      {
                        titulo: 'Restaurante',
                        ruta: '/carnet',
                        icono: 'fa-solid fa-utensils',
                        info: 'Consulta, cambio de foto para los diferentes estamentos de la institución y aclaración de las dependencias que administran la información de cada estamento.',
                      }
                    );
                  }
                  break;
                case 3: //DOCENTE
                  this.links.push({
                    titulo: 'Academico D.',
                    ruta: '/carnet',
                    icono: 'fa-solid fa-building-columns',
                    info: 'Consulta, cambio de foto para los diferentes estamentos de la institución y aclaración de las dependencias que administran la información de cada estamento.',
                  });
                  break;
                case 6: //INTERCAMBIO
                  this.links.push(
                    {
                      titulo: 'Academico E.',
                      ruta: '/carnet',
                      icono: 'fa-solid fa-building-columns',
                      info: 'Consulta, cambio de foto para los diferentes estamentos de la institución y aclaración de las dependencias que administran la información de cada estamento.',
                    },
                    {
                      titulo: 'Restaurante',
                      ruta: '/carnet',
                      icono: 'fa-solid fa-utensils',
                      info: 'Consulta, cambio de foto para los diferentes estamentos de la institución y aclaración de las dependencias que administran la información de cada estamento.',
                    }
                  );
                  break;
              }
            }
          });
      }
    });
  }

  toggleSubMenu(menu: string) {
    this.subMenus[menu] = !this.subMenus[menu]; // Alterna el valor entre true/false
  }

  obtenerFoto() {
    this.fotoService
      .mirarFoto('' + this.auth.user.personaCodigo)
      .subscribe((data) => {
        var img = new Blob([data], { type: 'application/json' });
        if (img.size !== 4) {
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

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
