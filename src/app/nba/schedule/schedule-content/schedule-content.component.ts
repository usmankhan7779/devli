import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimeZoneService } from '../../../shared/services/time-zone.service';
import { CommonScheduleService } from '../../../shared/services/common-schedule.service';
import { ScheduleService } from '../schedule.service';

@Component({
  selector: 'app-schedule-content',
  templateUrl: './schedule-content.component.html',
  styleUrls: ['./schedule-content.component.scss']
})
export class ScheduleContentComponent implements OnInit {
  @Input() startDate = new Date('10/1/16');
  @Input() preSelectedDate;
  @Output() returnData = new EventEmitter();
  @Output() matchupLinkClicked = new EventEmitter();

  scheduleSubscription: any;
  scheduleItems: Array<Object>;
  timeZone = this.timeZoneService.getTimeZoneAbbr();
  loading = false;
  constructor(
    private timeZoneService: TimeZoneService,
    private commonScheduleService: CommonScheduleService,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit() {
  }

  sortScoreOrStatus(game) {
    return game.status === 'Final' ?
      parseInt((game.away_team_score > game.home_team_score ? game.away_team_score : game.home_team_score), 10)
      : -1;
  }

  updateDate(date: string) {
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
