import { Directive, HostListener, Input } from '@angular/core';
import { ScheduleService } from '../../../nfl/schedule/schedule.service';

@Directive({
  selector: '[appPreselectNflScheduleTeamSeason]'
})
export class PreselectNflScheduleTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectNflScheduleTeamSeason') season: string;
  constructor(
    private scheduleService: ScheduleService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.scheduleService.setPreSelectedTeamSeason(this.season);
    }
  }
}
