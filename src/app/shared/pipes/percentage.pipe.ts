import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

  transform(value: string, multiplyByHundred = false): any {
    if (value != null) {
      if (multiplyByHundred && !isNaN(parseFloat(value))) {
        return (Math.round((parseFloat(value) * 100) * 100) / 100) + '%';
      }
      return value + '%';
    }
    return value;
  }

}
