import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Foto } from './models/foto';
import { FotoService } from './services/foto.service';
import { EstamentoService } from './services/estamento.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  links: any[] = [];
  isAuthenticated = false;
  title = 'USCO A LA MANO';
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
  ) {
    this.showSplash();
  }

  async showSplash() {
    await SplashScreen.show({
      autoHide: true,
      showDuration: 3000,
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  ngOnInit() {
    this.links = [];
    this.links = [
      {
        titulo: 'Credencial',
        ruta: '/credenciales',
        icono: 'fa-solid fa-id-card',
      },
    ];
    this.auth.authStatus.subscribe((status) => {
      this.isAuthenticated = status;
      this.cdr.detectChanges(); // Forzar la detección de cambios
      if (this.isAuthenticated) {
        this.obtenerFoto(); // Cargar foto solo si está autenticado
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
                        icono: 'fa-solid fa-building-columns',
                      },
                      {
                        titulo: 'Restaurante',
                        ruta: '/restaurante/ventanilla',
                        icono: 'fa-solid fa-utensils',
                      },
                      {
                        titulo: 'Biblioteca',
                        ruta: '/biblioteca',
                        icono: 'fa-solid fa-book',
                      }
                    );
                  }
                  break;
                case 3: //DOCENTE
                  this.links.push({
                    titulo: 'Academico D.',
                    ruta: '/academico-docente/carga-academica',
                    icono: 'fa-solid fa-building-columns',
                  });
                  break;
                case 6: //INTERCAMBIO
                  this.links.push(
                    {
                      titulo: 'Academico E.',
                      ruta: '/academico-estudiante/matricula',
                      icono: 'fa-solid fa-building-columns ',
                    },
                    {
                      titulo: 'Restaurante',
                      ruta: '/restaurante/ventanilla',
                      icono: 'fa-solid fa-utensils ',
                    },
                    {
                      titulo: 'Biblioteca',
                      ruta: '/biblioteca',
                      icono: 'fa-solid fa-book ',
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
