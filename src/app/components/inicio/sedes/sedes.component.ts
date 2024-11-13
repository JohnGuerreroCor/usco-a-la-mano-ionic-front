import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.css'],
})
export class SedesComponent implements OnInit {
  links: any[] = [];

  constructor() {}

  ngOnInit() {
    this.links = [
      {
        titulo: 'Neiva',
        ruta: '/sub-sedes',
        img: 'assets/sedes/neiva/central/neiva-central.jpg',
      },
      {
        titulo: 'Garzón',
        ruta: '/credenciales',
        img: 'assets/sedes/garzon/garzon.jpg',
      },
      {
        titulo: 'Pitalito',
        ruta: '/credenciales',
        img: 'assets/sedes/pitalito/pitalito.jpg',
      },
      {
        titulo: 'La Plata',
        ruta: '/credenciales',
        img: 'assets/sedes/laplata/laplata.jpg',
      },
    ];
  }
}
