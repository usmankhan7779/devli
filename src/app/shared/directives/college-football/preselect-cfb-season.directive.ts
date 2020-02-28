import { Directive, HostListener, Input } from '@angular/core';
import { CollegeFootballService } from '../../../college-football/college-football.service';

@Directive({
  selector: '[appPreselectCfbSeason]'
})
export class PreselectCfbSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectMlbLineupTeamSeason') season: string;
  constructor(
    private collegeFootballService: CollegeFootballService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.collegeFootballService.setPreSelectedSeason(this.season);
    }
  }
}
