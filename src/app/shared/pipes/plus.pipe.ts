import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plus',
  pure: false
})
export class PlusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (parseFloat(value) > 0) {
      value = '+' + value;
    }
    return value + '';
  }

}
