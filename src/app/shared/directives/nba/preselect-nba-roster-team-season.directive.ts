import { Directive, HostListener, Input } from '@angular/core';
import { RosterService } from '../../../nba/roster/roster.service';

@Directive({
  selector: '[appPreselectNbaRosterTeamSeason]'
})
export class PreselectNbaRosterTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectNbaRosterTeamSeason') season: string;
  constructor(
    private rosterService: RosterService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.rosterService.setPreSelectedTeamSeason(this.season);
    }
  }
}
