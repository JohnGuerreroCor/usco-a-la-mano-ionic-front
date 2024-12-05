import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { WebparametroService } from 'src/app/services/webparametro.service';
import { ToastController } from '@ionic/angular';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class LoginComponent implements OnInit {
  // Modelo para almacenar los datos del usuario del formulario de inicio de sesión
  usuario: Usuario = new Usuario();
  alertButtons = ['Action'];

  // Booleano para ocultar/mostrar la contraseña
  hide = true;

  // Booleano para mostrar/ocultar un componente específico en la plantilla
  alert = false;
  error: string = '';

  // Objeto Date que representa la fecha actual
  today = new Date();

  // Booleano para indicar si la autenticación está en progreso
  cargando: boolean = false;

  // Formulario Reactivo que maneja los campos de inicio de sesión
  formLogin!: FormGroup;

  constructor(
    public authService: AuthService,
    public webparametroService: WebparametroService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargando = false;
    // Crear el formulario de inicio de sesión
    this.crearFormularioLogin();

    // Si el usuario ya ha iniciado sesión, redirigirlo a la página de inicio o de token según el caso
    if (this.authService.isAuthenticated()) {
      if (this.authService.codigoverificacion != null) {
        // Mostrar un mensaje de notificación si ya se ha iniciado sesión con un token de verificación
        this.toastController
          .create({
            message: 'Ya se ha iniciado sesión.',
            duration: 2500,
            position: 'top',
            color: 'info',
            icon: 'information-circle-outline',
          })
          .then((toast) => {
            toast.present(); // Muestra el toast
          });

        // Redirigir al usuario a la página de inicio
        this.router.navigate(['inicio']);
      } else {
        // Redirigir al usuario a la página de inicio o de token según el valor del parámetro web
        this.webparametroService.obtenerWebParametro().subscribe((data) => {
          if (data[0].webValor === '1') {
            this.router.navigate(['/login']);
          } else {
            this.router.navigate(['/inicio']);
          }
        });
      }
    }
  }

  // Método privado para crear el formulario de inicio de sesión utilizando el FormBuilder
  private crearFormularioLogin(): void {
    this.formLogin = this.formBuilder.group({
      // Campo para el nombre de usuario, con validador de obligatorio
      usuario: new FormControl('', Validators.required),

      // Campo para la contraseña, con validador de obligatorio
      contrasenia: new FormControl('', Validators.required),
    });
  }

  // Método para realizar el inicio de sesión del usuario
  login(): void {
    this.cargando = true;
    this.usuario.username = this.formLogin.get('usuario')!.value;
    this.usuario.password = this.formLogin.get('contrasenia')!.value;

    // Realizar la solicitud de inicio de sesión al servicio authService
    this.authService.login(this.usuario).subscribe(
      (response) => {
        // Si el inicio de sesión es exitoso, guardar el token y redirigir al usuario según el valor del parámetro web
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);

        // Redirigir al usuario a la página de inicio o de token según el valor del parámetro web
        /* this.toastController
          .create({
            message: 'Inicio de sesión exitoso.',
            duration: 2500,
            position: 'top',
            color: 'success',
            icon: 'checkmark-circle', // Puedes usar un icono de Ionic
          })
          .then((toast) => {
            toast.present(); // Muestra el toast
          }); */
        this.webparametroService.obtenerWebParametro().subscribe((data) => {
          this.alert = false; // Activar la alerta en la interfaz
          if (data[0].webValor === '1') {
            this.router.navigate(['/token']);
          } else {
            this.router.navigate(['/inicio']);
          }
        });
      },
      (err) => this.fError(err)
    );
  }

  fError(er: { error: { error_description: any } }): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    this.alert = true; // Activar la alerta en la interfaz
    this.error = 'Usuario y/o contraseña incorrectos.'; // Asignar el mensaje de error

    if (arr[0] == 'Access token expired') {
      this.router.navigate(['login']);
    }
    this.cargando = false;
  }
}
