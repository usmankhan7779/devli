import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pointZero'
})
export class PointZeroPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (value) {
      return value.toString().replace('0.', '.');
    }
    return value;
  }

}
