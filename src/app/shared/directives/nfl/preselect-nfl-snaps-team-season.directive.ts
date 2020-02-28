import { Directive, HostListener, Input } from '@angular/core';
import { TeamSnapCountsService } from '../../../nfl/team-snap-counts-page/team-snap-counts.service';

@Directive({
  selector: '[appPreselectNflSnapsTeamSeason]'
})
export class PreselectNflSnapsTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectNflSnapsTeamSeason') season: string;
  constructor(
    private teamSnapCountsService: TeamSnapCountsService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.teamSnapCountsService.setPreSelectedTeamSeason(this.season);
    }
  }
}
