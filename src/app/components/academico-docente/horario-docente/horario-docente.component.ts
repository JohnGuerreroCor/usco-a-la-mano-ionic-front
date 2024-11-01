import { Component } from '@angular/core';
import { AcademicoService } from 'src/app/services/academico.service';
import { EstamentoService } from 'src/app/services/estamento.service';
import { AuthService } from 'src/app/services/auth.service';
import { DiaHorario } from 'src/app/models/dia-horario';
import { HorarioDocente } from 'src/app/models/horario-docente';

@Component({
  selector: 'app-horario-docente',
  templateUrl: './horario-docente.component.html',
  styleUrls: ['./horario-docente.component.css'],
})
export class HorarioDocenteComponent {
  dias: DiaHorario[] = [];
  horario: HorarioDocente[] = [];
  periodoActual!: string;
  diaActivo: number = 0;
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
    this.fechaYHora = this.obtenerFechaYHora();
    this.obtenerPeriodoActual();
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

  verificarIntervalo(item: HorarioDocente): boolean {
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

  obtenerPeriodoActual() {
    this.academicoService.obtenerPeridoActual().subscribe((data) => {
      this.periodoActual = data;
      this.obtenerDiasHorario();
      this.obtenerHorario();
    });
  }

  obtenerDiasHorario() {
    this.academicoService
      .obtenerDiasHorarioDocente(
        this.authService.user.personaCodigo,
        this.periodoActual
      )
      .subscribe((data) => {
        this.dias = data;
      });
  }

  obtenerHorario() {
    this.academicoService
      .obtenerHorarioDocente(
        this.authService.user.personaCodigo,
        this.periodoActual
      )
      .subscribe((data) => {
        this.horario = data;
      });
  }
}
