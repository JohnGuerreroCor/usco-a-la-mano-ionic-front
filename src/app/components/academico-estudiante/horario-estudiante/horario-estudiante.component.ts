import { Component, OnInit } from '@angular/core';
import { FichaAcademica } from './../../../models/ficha-academica';
import { CarnetDigital } from 'src/app/models/carnet-digital';
import { AcademicoService } from 'src/app/services/academico.service';
import { EstamentoService } from 'src/app/services/estamento.service';
import { AuthService } from 'src/app/services/auth.service';
import { Matricula } from 'src/app/models/matricula';
import { FichaAcademicaRegistro } from 'src/app/models/ficha-academica-registro';
import { DiaHorario } from 'src/app/models/dia-horario';
import { Periodo } from 'src/app/models/periodo';
import { HorarioEstudiante } from 'src/app/models/horario-estudiante';

@Component({
  selector: 'app-horario-estudiante',
  templateUrl: './horario-estudiante.component.html',
  styleUrls: ['./horario-estudiante.component.css'],
})
export class HorarioEstudianteComponent implements OnInit {
  dias: DiaHorario[] = [];
  horario: HorarioEstudiante[] = [];
  codigoEstudiante!: string;
  puntajeCalificadoPonderado!: number;
  planAcademico!: number;
  listadoCursos: Matricula[] = [];
  fichaAcademica: FichaAcademica[] = [];
  fichaAcademicaRegistro: FichaAcademicaRegistro[] = [];
  carnet: CarnetDigital[] = [];
  collapsedState: boolean[] = []; // Aquí almacenamos el estado de colapso de cada ítem
  curso: any;
  periodoActual!: string;
  diaActivo: number = 0;
  periodo: string = '20242';
  listadoPeriodos: Periodo[] = [];
  hora: any;
  dia: any;
  fechaYHora!: { dia: string; hora: string };

  selectedSegment: number = 0;

  constructor(
    public academicoService: AcademicoService,
    public estamentoService: EstamentoService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerCodigoEstudiante();
    this.fechaYHora = this.obtenerFechaYHora();
  }
  
  onSegmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  obtenerFechaYHora(): { dia: string; hora: string } {
    const diasSemana = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miercoles',
      'Jueves',
      'Viernes',
      'Sabado',
    ];
    const fechaActual = new Date();

    const dia = diasSemana[fechaActual.getDay()];
    let hora = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const periodo = hora >= 12 ? 'PM' : 'AM';

    // Formatear la hora en formato de 12 horas y asegurar dos dígitos para los minutos
    hora = hora % 12 || 12; // Si es 0, se considera como 12
    const horaFormateada = hora < 10 ? '0' + hora : hora;
    const minutosFormateados = minutos < 10 ? '0' + minutos : minutos;

    const horaCompleta = `${horaFormateada}:${minutosFormateados}${periodo}`;

    return { dia, hora: horaCompleta };
  }

  verificarIntervalo(item: HorarioEstudiante): boolean {
    if (item.diaNombre == this.fechaYHora.dia) {
      const horaActual = new Date();
      const inicio = this.convertirStringAHora(item.horaInicio);
      const fin = this.convertirStringAHora(item.horaFin);

      // Crear objetos Date con la misma fecha y horas y minutos de los intervalos
      const horaInicio = new Date();
      horaInicio.setHours(inicio.horas);
      horaInicio.setMinutes(inicio.minutos);

      const horaFin = new Date();
      horaFin.setHours(inicio.horas + 1);
      horaFin.setMinutes(inicio.minutos);

      return horaActual >= horaInicio && horaActual <= horaFin;
    }
    return false;
  }

  convertirStringAHora(str: string): { horas: number; minutos: number } {
    const partes = str.split(/:|(?=[AP]M)/); // Usar expresión regular para dividir la cadena por ":" o antes de "AM" o "PM"
    let horas = parseInt(partes[0], 10);
    const minutos = parseInt(partes[1], 10);
    const periodo = partes[2]; // Obtener el período (AM o PM)

    // Si es PM y no es mediodía, agregar 12 horas
    if (periodo === 'PM' && horas !== 12) {
      horas += 12;
    }

    // Si es AM y son las 12 de la madrugada, poner las horas a 0
    if (periodo === 'AM' && horas === 12) {
      horas = 0;
    }

    return { horas, minutos };
  }

  obtenerCodigoEstudiante() {
    let aux = this.authService.user.username.split('u');
    this.codigoEstudiante = aux[1].trim();
    this.obtenerPlanAcademico(this.codigoEstudiante);
    this.obtenerPeriodoActual();
  }

  obtenerPlanAcademico(codigo: string) {
    this.academicoService.obtenerPlanAcademico(codigo).subscribe((data) => {
      this.planAcademico = data;
      this.obtenerMatriculas();
    });
  }

  obtenerPeriodoActual() {
    this.academicoService.obtenerPeridoActual().subscribe((data) => {
      this.periodoActual = data;
      this.obtenerDiasHorario();
      this.obtenerHorario();
    });
  }

  obtenerDiasHorario() {
    this.academicoService
      .obtenerDiasHorarioEstudiante(this.codigoEstudiante, this.periodoActual)
      .subscribe((data) => {
        this.dias = data;
      });
  }

  obtenerHorario() {
    this.academicoService
      .obtenerHorarioEstudiante(this.codigoEstudiante, this.periodoActual)
      .subscribe((data) => {
        this.horario = data;
      });
  }

  obtenerMatriculas() {
    this.academicoService
      .obtenerMatriculas(this.planAcademico, this.codigoEstudiante)
      .subscribe((data) => {
        this.listadoPeriodos = data;
      });
  }

  obtenerMatriculaActualPorPeriodo(periodo: string) {
    this.dias = [];
    this.horario = [];
    this.academicoService
      .obtenerDiasHorarioEstudiante(this.codigoEstudiante, periodo)
      .subscribe((data) => {
        this.dias = data;
      });
    this.academicoService
      .obtenerHorarioEstudiante(this.codigoEstudiante, periodo)
      .subscribe((data) => {
        this.horario = data;
      });
  }
}
