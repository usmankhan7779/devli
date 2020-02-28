import { Directive, HostListener, Input } from '@angular/core';
import { RosterService } from '../../../nfl/roster/roster.service';

@Directive({
  selector: '[appPreselectNflRosterTeamSeason]'
})
export class PreselectNflRosterTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectNflRosterTeamSeason') season: string;
  constructor(
    private rosterService: RosterService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.rosterService.setPreSelectedTeamSeason(this.season);
    }
  }
}
