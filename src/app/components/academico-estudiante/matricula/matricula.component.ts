import { Component, OnInit } from '@angular/core';
import { CarnetDigital } from 'src/app/models/carnet-digital';
import { Matricula } from 'src/app/models/matricula';
import { AcademicoService } from 'src/app/services/academico.service';
import { AuthService } from 'src/app/services/auth.service';
import { EstamentoService } from 'src/app/services/estamento.service';
import { Periodo } from 'src/app/models/periodo';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.css'],
})
export class MatriculaComponent implements OnInit {
  listadoCursos: Matricula[] = [];
  listadoPeriodos: Periodo[] = [];
  carnet: CarnetDigital[] = [];
  codigoEstudiante!: string;
  periodoActual!: string;
  planAcademico!: number;
  periodo!: string;

  constructor(
    public academicoService: AcademicoService,
    public authService: AuthService,
    public estamentoService: EstamentoService
  ) {}

  ngOnInit(): void {
    this.periodo = '20242';
    this.obtenerPeriodoActual();
    this.obtenerCodigoEstudiante();
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

  obtenerMatriculaActualPorPeriodo(periodo: string) {
    this.listadoCursos = [];
    this.academicoService
      .obtenerMatriculaActual(
        this.planAcademico,
        this.codigoEstudiante,
        periodo
      )
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
}
