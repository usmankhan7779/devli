import { Directive, HostListener, Input } from '@angular/core';
import { IndTeamStatsService } from '../../../nfl/teams/ind-team-stats/ind-team-stats.service';

@Directive({
  selector: '[appPreselectNflStatsTeamSeason]'
})
export class PreselectNflStatsTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectNflStatsTeamSeason') season: string;
  constructor(
    private indTeamStatsService: IndTeamStatsService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.indTeamStatsService.setPreSelectedTeamSeason(this.season);
    }
  }
}
