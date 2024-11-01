import { Component, OnInit } from '@angular/core';
import { CarnetDigital } from 'src/app/models/carnet-digital';
import { AcademicoService } from 'src/app/services/academico.service';
import { AuthService } from 'src/app/services/auth.service';
import { EstamentoService } from 'src/app/services/estamento.service';
import { Periodo } from 'src/app/models/periodo';
import { CargaAcademica } from 'src/app/models/carga-academica';

@Component({
  selector: 'app-carga-academica',
  templateUrl: './carga-academica.component.html',
  styleUrls: ['./carga-academica.component.css'],
})
export class CargaAcademicaComponent implements OnInit {
  listadoCursos: CargaAcademica[] = [];
  listadoPeriodos: Periodo[] = [];
  carnet: CarnetDigital[] = [];
  codigoEstudiante!: string;
  periodoActual!: string;
  planAcademico!: number;
  periodo: string = '20241';

  constructor(
    public academicoService: AcademicoService,
    public authService: AuthService,
    public estamentoService: EstamentoService
  ) {}

  ngOnInit(): void {
    this.obtenerPeriodoActual();
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
      this.academicoService
        .obtenerCargaAcademica(
          this.authService.user.personaCodigo,
          this.periodoActual
        )
        .subscribe((data) => {
          this.listadoCursos = data;
        });
    });
  }

  obtenerPlanAcademico(codigo: string) {
    this.academicoService.obtenerPlanAcademico(codigo).subscribe((data) => {
      this.planAcademico = data;
      this.obtenerMatriculas();
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
