import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimeZoneService } from '../../../shared/services/time-zone.service';
import { CommonScheduleService } from '../../../shared/services/common-schedule.service';
import { ScheduleService } from '../schedule.service';
import { MatchupsGatewayService } from '../../matchups-gateway/matchups-gateway.service';

@Component({
  selector: 'app-schedule-content',
  templateUrl: './schedule-content.component.html',
  styleUrls: ['./schedule-content.component.scss']
})
export class ScheduleContentComponent implements OnInit {
  @Input() startDate = new Date('4/1/17');
  @Input() preSelectedDate;
  @Output() returnData = new EventEmitter();
  @Output() matchupLinkClicked = new EventEmitter();

  activeYear: number;
  timeZone = this.timeZoneService.getTimeZoneAbbr();
  scheduleItems: Array<Object>;
  scheduleSubscription: Subscription;
  loading: boolean;
  constructor(
    private matchupsGatewayService: MatchupsGatewayService,
    private scheduleService: ScheduleService,
    private timeZoneService: TimeZoneService,
    private commonScheduleService: CommonScheduleService,
  ) { }

  ngOnInit() {
  }

  sortScoreOrStatus(game) {
    return game.status === 'Final' ? parseInt(game.score.split('-')[0], 10) : -1;
  }

  updateDate(date: string) {
    this.activeYear = new Date(date).getFullYear();
    this.loading = true;
    if (this.scheduleSubscription) {
      // Killing pending API requests in the event of subsequent new one
      this.scheduleSubscription.unsubscribe();
    }

    this.scheduleSubscription = this.scheduleService.fetchScheduleFor(date)
      .subscribe(
        result => {
          this.returnData.emit(result);
          this.scheduleItems = this.commonScheduleService.formatScheduleData(result.data).reverse();
          this.loading = false;
        },
        err => console.log(err)
      );
  }

  onMatchupLinkClick() {
    this.matchupLinkClicked.emit();
  }
}
