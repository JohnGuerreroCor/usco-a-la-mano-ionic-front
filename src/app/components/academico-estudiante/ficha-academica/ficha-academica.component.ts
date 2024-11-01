import { Component, OnInit } from '@angular/core';
import { FichaAcademica } from './../../../models/ficha-academica';
import { CarnetDigital } from 'src/app/models/carnet-digital';
import { AcademicoService } from 'src/app/services/academico.service';
import { EstamentoService } from 'src/app/services/estamento.service';
import { AuthService } from 'src/app/services/auth.service';
import { Matricula } from 'src/app/models/matricula';
import { FichaAcademicaRegistro } from 'src/app/models/ficha-academica-registro';

@Component({
  selector: 'app-ficha-academica',
  templateUrl: './ficha-academica.component.html',
  styleUrls: ['./ficha-academica.component.css'],
})
export class FichaAcademicaComponent implements OnInit {
  codigoEstudiante!: string;
  puntajeCalificadoPonderado!: number;
  planAcademico!: number;
  listadoCursos: Matricula[] = [];
  fichaAcademica: FichaAcademica[] = [];
  fichaAcademicaRegistro: FichaAcademicaRegistro[] = [];
  carnet: CarnetDigital[] = [];
  collapsedState: boolean[] = []; // Aquí almacenamos el estado de colapso de cada ítem
  curso: any;
  alert: boolean = false;

  constructor(
    public academicoService: AcademicoService,
    public estamentoService: EstamentoService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerCodigoEstudiante();
  }

  toggleCollapse(index: number) {
    this.collapsedState[index] = !this.collapsedState[index];
  }

  isCollapsed(index: number): boolean {
    return this.collapsedState[index];
  }

  obtenerCodigoEstudiante() {
    let aux = this.authService.user.username.split('u');
    this.codigoEstudiante = aux[1].trim();
    this.obtenerPlanAcademico(this.codigoEstudiante);
    this.obtenerPuntajeCalificadoPonderado(this.codigoEstudiante);
  }

  obtenerPlanAcademico(codigo: string) {
    this.academicoService.obtenerPlanAcademico(codigo).subscribe((data) => {
      this.planAcademico = data;
      this.obtenerFichaAcademica();
      this.obtenerFichaAcademicaRegistro();
    });
  }

  obtenerFichaAcademica() {
    this.academicoService
      .obtenerFichaAcademica(this.planAcademico, this.codigoEstudiante)
      .subscribe((data) => {
        this.fichaAcademica = data;
        this.obtenerMatriculaActualPorPeriodo();
      });
  }

  obtenerPuntajeCalificadoPonderado(codigoEstudiante: string) {
    this.academicoService
      .obtenerPuntajePonderado(codigoEstudiante)
      .subscribe((data) => {
        this.puntajeCalificadoPonderado = data;
        if (JSON.stringify(data) == '') {
          this.alert = false;
        } else {
          this.alert = true;
        }
      });
  }

  obtenerMatriculaActualPorPeriodo() {
    this.listadoCursos = [];
    this.academicoService
      .obtenerFichaAcademicaCursos(this.planAcademico, this.codigoEstudiante)
      .subscribe((data) => {
        this.listadoCursos = data;
      });
  }

  obtenerFichaAcademicaRegistro() {
    this.listadoCursos = [];
    this.academicoService
      .obtenerFichaAcademicaRegistro(this.codigoEstudiante)
      .subscribe((data) => {
        this.fichaAcademicaRegistro = data;
      });
  }
}
