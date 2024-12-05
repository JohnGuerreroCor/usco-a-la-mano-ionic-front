import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-sedes',
  templateUrl: './sub-sedes.component.html',
  styleUrls: ['./sub-sedes.component.css'],
})
export class SubSedesComponent implements OnInit {
  links: any[] = [];
  isLoading = false;

  constructor() {}

  onImageLoad() {
    setTimeout(() => {
      this.isLoading = true;
    }, 1000);
  }

  ngOnInit() {
    this.links = [
      {
        titulo: 'Central',
        ruta: '/campus-neiva-central',
        img: 'assets/sedes/neiva/central/neiva-central.jpg',
        descripcion: 'Visualiza los bloques de la subsede Central de Neiva.',
      },
      {
        titulo: 'Posgrados',
        ruta: '/sub-sedes',
        img: 'assets/sedes/neiva/posgrados/posgrados.jpg',
        descripcion: 'Visualiza los bloques de la subsede Posgrados de Neiva.',
      },
      {
        titulo: 'Salud',
        ruta: '/sub-sedes',
        img: 'assets/sedes/neiva/salud/neiva-salud.jpg',
        descripcion: 'Visualiza los bloques de la subsede Salud de Neiva',
      },
    ];
  }
}
