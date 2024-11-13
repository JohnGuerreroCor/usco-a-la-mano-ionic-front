import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-sedes',
  templateUrl: './sub-sedes.component.html',
  styleUrls: ['./sub-sedes.component.css'],
})
export class SubSedesComponent implements OnInit {
  links: any[] = [];

  constructor() {}

  ngOnInit() {
    this.links = [
      {
        titulo: 'Central',
        ruta: '/campus-neiva-central',
        img: 'assets/sedes/neiva/central/neiva-central.jpg',
      },
      {
        titulo: 'Posgrados',
        ruta: '/credenciales',
        img: 'assets/sedes/neiva/posgrados/posgrados.jpg',
      },
      {
        titulo: 'Salud',
        ruta: '/credenciales',
        img: 'assets/sedes/neiva/salud/neiva-salud.jpg',
      },
    ];
  }
}
