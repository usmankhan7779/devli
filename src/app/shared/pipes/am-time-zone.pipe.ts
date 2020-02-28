import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min';
import { TimeZoneService } from '../services/time-zone.service';

@Pipe({ name: 'amTimeZone' })
export class AmTimeZonePipe implements PipeTransform {

  constructor(
    private timeZoneService: TimeZoneService
  ) {}


  transform(value: any): moment.Moment {
    if (value && this.timeZoneService.serverTz) {
      return moment.tz(value, this.timeZoneService.serverTz);
    }
    return value;
  }
}
