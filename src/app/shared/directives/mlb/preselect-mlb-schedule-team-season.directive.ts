import { Directive, HostListener, Input } from '@angular/core';
import { ScheduleService } from '../../../mlb/schedule/schedule.service';

@Directive({
  selector: '[appPreselectMlbScheduleTeamSeason]'
})
export class PreselectMlbScheduleTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectMlbScheduleTeamSeason') season: string;
  constructor(
    private scheduleService: ScheduleService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.scheduleService.setPreSelectedTeamSeason(this.season);
    }
  }
}
