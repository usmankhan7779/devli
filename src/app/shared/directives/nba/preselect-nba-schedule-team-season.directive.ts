import { Directive, HostListener, Input } from '@angular/core';
import { ScheduleService } from '../../../nba/schedule/schedule.service';

@Directive({
  selector: '[appPreselectNbaScheduleTeamSeason]'
})
export class PreselectNbaScheduleTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectNbaScheduleTeamSeason') season: string;
  constructor(
    private scheduleService: ScheduleService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.scheduleService.setPreSelectedTeamSeason(this.season);
    }
  }
}
