import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberWithCommas'
})
export class NumberWithCommasPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (value) {
      if ((typeof value === 'number' && value < 1000) || (typeof value === 'string' && value.length < 4)) {
        return value;
      }
      const parts = value.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    }
    return value;
  }

}
