import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.css'],
})
export class SedesComponent implements OnInit {
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
        titulo: 'Neiva',
        ruta: '/sub-sedes',
        img: 'assets/sedes/neiva/central/neiva-central.jpg',
        descripcion: 'Visualiza cada una de las subsedes de Neiva.',
      },
      {
        titulo: 'Garzón',
        ruta: '/sedes',
        img: 'assets/sedes/garzon/garzon.jpg',
        descripcion: 'Visualiza los bloques de la sede Garzón.',
      },
      {
        titulo: 'Pitalito',
        ruta: '/sedes',
        img: 'assets/sedes/pitalito/pitalito.jpg',
        descripcion: 'Visualiza los bloques de la sede Pitalito.',
      },
      {
        titulo: 'La Plata',
        ruta: '/sedes',
        img: 'assets/sedes/laplata/laplata.jpg',
        descripcion: 'Visualiza los bloques de la sede La Plata.',
      },
    ];
  }
}
