import { Component } from '@angular/core';
import { AcademicoService } from 'src/app/services/academico.service';
import { AuthService } from 'src/app/services/auth.service';
import { EstamentoService } from 'src/app/services/estamento.service';
import { ActivatedRoute } from '@angular/router';
import { EstudiantesCurso } from 'src/app/models/estudiantes-curso';

@Component({
  selector: 'app-listado-estudiantes',
  templateUrl: './listado-estudiantes.component.html',
  styleUrls: ['./listado-estudiantes.component.css'],
})
export class ListadoEstudiantesComponent {
  listadoEstudiantes: EstudiantesCurso[] = [];
  periodoActual!: string;
  curso!: number;

  constructor(
    public academicoService: AcademicoService,
    public authService: AuthService,
    public estamentoService: EstamentoService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.curso = params['id'];
      this.academicoService
        .obtenerListadoEstudiantes(this.curso)
        .subscribe((data) => {
          this.listadoEstudiantes = data;
        });
    });
  }

  ngOnInit(): void {
    this.obtenerPeriodoActual();
  }

  obtenerPeriodoActual() {
    this.academicoService.obtenerPeridoActual().subscribe((data) => {
      this.periodoActual = data;
    });
  }
}
