import * as moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ServerResponseService } from './server-response.service';

@Injectable({
  providedIn: 'root'
})
export class TimeZoneService {
  serverTz: string;
  constructor(
    private serverResponseService: ServerResponseService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) {
      const tz = this.serverResponseService.getHeader('x-timezone');
      if (tz) {
        this.serverTz = tz;
      }
    }
  }

  getTimeZoneAbbr() {
    const timeZone = moment.tz(this.serverTz || moment.tz.guess()).zoneAbbr().toUpperCase();
    switch (timeZone) {
      case 'EST': {
        return 'ET';
      }
      case 'PST': {
        return 'PT';
      }
      case 'PDT': {
        return 'PT';
      }
      default: {
        return timeZone;
      }
    }
  }
}
