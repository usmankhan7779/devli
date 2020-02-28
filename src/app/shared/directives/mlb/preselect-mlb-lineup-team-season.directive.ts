import { Directive, HostListener, Input } from '@angular/core';
import { TeamLineupService } from '../../../mlb/team-lineup/team-lineup.service';

@Directive({
  selector: '[appPreselectMlbLineupTeamSeason]'
})
export class PreselectMlbLineupTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectMlbLineupTeamSeason') season: string;
  constructor(
    private teamLineupService: TeamLineupService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.teamLineupService.setPreSelectedTeamSeason(this.season);
    }
  }
}
