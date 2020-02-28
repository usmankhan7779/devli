import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'ordinal'})

export class OrdinalPipe implements PipeTransform {
  transform(int) {
    if (typeof int === 'string') {
      if (int.indexOf('th') !== -1 || int.indexOf('st') !== -1 || int.indexOf('nd') !== -1 || int.indexOf('rd') !== -1) {
        return int;
      }
      int = parseInt(int, 10);
    }
    if (typeof int === 'number') {
      const ones = +int % 10, tens = +int % 100 - ones;
      return int + ['th', 'st', 'nd', 'rd'][ tens === 10 || ones > 3 ? 0 : ones ];
    }
    return int;
  }
}
