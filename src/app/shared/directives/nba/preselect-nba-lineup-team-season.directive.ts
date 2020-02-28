import { Directive, HostListener, Input } from '@angular/core';
import { TeamLineupService } from '../../../nba/team-lineup/team-lineup.service';

@Directive({
  selector: '[appPreselectNbaLineupTeamSeason]'
})
export class PreselectNbaLineupTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectNbaLineupTeamSeason') season: string;
  constructor(
    private teamLineupService: TeamLineupService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.teamLineupService.setPreSelectedTeamSeason(this.season);
    }
  }
}
