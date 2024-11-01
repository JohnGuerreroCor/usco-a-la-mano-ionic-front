# Módulo USCO a la Mano Ionic Front

![Logo de la USCO](https://www.usco.edu.co/imagen-institucional/logo/universidad-surcolombiana.png)

Este módulo ha sido desarrollado utilizando las siguientes tecnologías:

- **Angular 15.2.11**  
  Documentación oficial: [https://angular.io/docs](https://www.npmjs.com/package/@angular/cli/v/15.2.11)

- **Angular Material 15**  
  Documentación oficial: [https://material.angular.io/](https://v15.material.angular.io/)

- **Bootstrap 4.6**  
  Documentación oficial: [https://getbootstrap.com/docs/4.6/getting-started/introduction/](https://getbootstrap.com/docs/4.6/getting-started/introduction/)

- **FontAwesome 6**  
  Documentación oficial: [https://fontawesome.com/docs](https://fontawesome.com/search?o=r&m=free)

- **Ionic Framework**  
  Documentación oficial: [https://ionicframework.com/docs](https://ionicframework.com/docs)

- **Capacitor**  
  Documentación oficial: [https://capacitorjs.com/docs](https://capacitorjs.com/docs)

## Descripción

Ofrece múltiples servicios que abarcan la parte de control de acceso con la credencial digital, restaurante universitario, biblioteca y consultas académicas.

## Instalación y Uso

1. Clona el repositorio:

   ```bash
   git clone https://github.com/usuario/repo.git
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Corre la aplicación en el navegador:
   ```bash
   ng serve
   ```

## Despliegue en Dispositivos Móviles

### Preparar para Capacitor

1. Añade la plataforma Android o iOS:

   ```bash
   ionic capacitor add android
   ionic capacitor add ios
   ```

2. Sincroniza los cambios del proyecto con Capacitor:

   ```bash
   ionic capacitor sync
   ```

### Compilación y Despliegue

- **Android**:  
  Abre el proyecto en Android Studio y ejecuta en un dispositivo o emulador:

   ```bash
   ionic capacitor open android
   ```

- **iOS**:  
  Abre el proyecto en Xcode y ejecuta en un dispositivo o simulador:

   ```bash
   ionic capacitor open ios
   ```
