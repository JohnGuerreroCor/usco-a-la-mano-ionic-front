import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'periodo',
})
export class PeriodoPipe implements PipeTransform {
  transform(value: string): string {
    // Verifica si el valor tiene el formato esperado
    if (value.match(/^\d{4}(1|2)$/)) {
      // Dividir el año y el mes
      const year = value.substr(0, 4);
      const month = value.charAt(4);
      // Formatear la fecha
      return `${year} - ${month}`;
    } else {
      // Devolver el valor sin cambios si no coincide con el formato esperado
      return value;
    }
  }
}
