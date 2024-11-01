import { Component, OnInit } from '@angular/core';
import { CarnetDigital } from 'src/app/models/carnet-digital';
import { Matricula } from 'src/app/models/matricula';
import { AcademicoService } from 'src/app/services/academico.service';
import { AuthService } from 'src/app/services/auth.service';
import { EstamentoService } from 'src/app/services/estamento.service';
import { Periodo } from 'src/app/models/periodo';
import { Notas } from 'src/app/models/notas';

@Component({
  selector: 'app-notas-parciales',
  templateUrl: './notas-parciales.component.html',
  styleUrls: ['./notas-parciales.component.css'],
})
export class NotasParcialesComponent implements OnInit {
  listadoCursos: Matricula[] = [];
  listadoPeriodos: Periodo[] = [];
  listadoNotasParciales: Notas[] = [];
  carnet: CarnetDigital[] = [];
  codigoEstudiante!: string;
  periodoActual!: string;
  planAcademico!: number;
  periodo: string = '20242';
  collapsedState: boolean[] = []; // Aquí almacenamos el estado de colapso de cada ítem

  constructor(
    public academicoService: AcademicoService,
    public authService: AuthService,
    public estamentoService: EstamentoService
  ) {}

  ngOnInit(): void {
    this.obtenerPeriodoActual();
    this.obtenerCodigoEstudiante();
  }

  toggleCollapse(index: number) {
    this.collapsedState[index] = !this.collapsedState[index];
  }

  isCollapsed(index: number): boolean {
    return this.collapsedState[index];
  }

  obtenerCodigoEstudiante() {
    this.estamentoService
      .obtenerCarnetEstamento(this.authService.user.personaCodigo)
      .subscribe((data) => {
        this.carnet = data;
        for (let index = 0; index < this.carnet.length; index++) {
          if (this.carnet[index].codigo === 2) {
            let aux = this.carnet[index].usuario.split('u');
            this.codigoEstudiante = aux[1];
            this.obtenerPlanAcademico(this.codigoEstudiante);
          }
        }
      });
  }

  obtenerPeriodoActual() {
    this.academicoService.obtenerPeridoActual().subscribe((data) => {
      this.periodoActual = data;
    });
  }

  obtenerPlanAcademico(codigo: string) {
    this.academicoService.obtenerPlanAcademico(codigo).subscribe((data) => {
      this.planAcademico = data;
      this.obtenerMatriculas();
      this.obtenerNotasParciales();
      this.obtenerMatriculaActual(
        this.planAcademico,
        codigo,
        this.periodoActual
      );
    });
  }

  obtenerMatriculaActual(plan: number, codigo: string, periodo: string) {
    this.academicoService
      .obtenerMatriculaActual(plan, codigo, periodo)
      .subscribe((data) => {
        this.listadoCursos = data;
      });
  }

  obtenerMatriculas() {
    this.academicoService
      .obtenerMatriculas(this.planAcademico, this.codigoEstudiante)
      .subscribe((data) => {
        this.listadoPeriodos = data;
      });
  }

  obtenerNotasParciales() {
    this.academicoService
      .obtenerNotasParciales(
        this.codigoEstudiante,
        this.planAcademico,
        this.periodo
      )
      .subscribe((data) => {});
  }

  obtenerNotasParcialesPorPeriodo(periodo: string) {
    this.listadoCursos = [];
    this.listadoNotasParciales = [];
    this.academicoService
      .obtenerMatriculaActual(
        this.planAcademico,
        this.codigoEstudiante,
        periodo
      )
      .subscribe((data) => {
        this.listadoCursos = data;
      });
    this.academicoService
      .obtenerNotasParciales(this.codigoEstudiante, this.planAcademico, periodo)
      .subscribe((data) => {
        this.listadoNotasParciales = data;
      });
  }
}
