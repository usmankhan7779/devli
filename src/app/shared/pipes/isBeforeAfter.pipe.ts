import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'isBeforeAfter'})
export class IsBeforeAfterPipe implements PipeTransform {
  // mode = isAfter || isBefore
  transform(array, mode, itemDateProp: string, date = new Date()) {
    if (mode) {
      mode = 'isAfter';
    } else {
      mode = 'isBefore';
    }
    return array.filter(function(item){
      return moment(item[itemDateProp])[mode](date);
    })
  }
}
