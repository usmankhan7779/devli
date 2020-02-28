import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'showPercentage'
})
export class ShowPercentagePipe implements PipeTransform {

  constructor() {}

  transform(value: string | number, prop: string, text = 'percentage'): string | number {
    if ((value || value === 0) && _.includes(prop, text)) {
      return `${value}%`;
    }
    return value;
  }
}
