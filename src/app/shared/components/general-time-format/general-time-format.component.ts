import { Component, Input, OnInit } from '@angular/core';
import { TimeZoneService } from '../../services/time-zone.service';
import * as moment from 'moment';

@Component({
  selector: 'app-general-time-format',
  templateUrl: './general-time-format.component.html',
  styleUrls: ['./general-time-format.component.scss']
})
export class GeneralTimeFormatComponent implements OnInit {
  @Input() time: string;
  @Input() showDay = true;
  @Input() showTZ = true;
  @Input() showTimeAgo: boolean;
  @Input() showSeoTime: boolean;

  timeZone = this.timeZoneService.getTimeZoneAbbr();

  constructor(
    private timeZoneService: TimeZoneService
  ) { }

  ngOnInit() {
  }

  isLessThan24Hours() {
    const ONE_HOUR = 60 * 60 * 1000;
    return (new Date().getTime() - new Date(this.time).getTime()) < (ONE_HOUR * 24);
  }

}
