import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../services/common.service';

@Pipe({ name: 'mobileMinutes' })
export class MobileMinutesPipe implements PipeTransform {

  constructor(
    private commonService: CommonService
  ) {}


  transform(value: any) {
    if (value && value.indexOf('minute') !== -1 && this.commonService.isBrowser() &&  window && window.innerWidth < 600) {
      return value.replace('minute', 'min')
    }
    return value;
  }
}
