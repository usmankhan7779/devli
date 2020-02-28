import { Directive, HostListener, Input } from '@angular/core';
import { RosterService } from '../../../mlb/roster/roster.service';

@Directive({
  selector: '[appPreselectMlbRosterTeamSeason]'
})
export class PreselectMlbRosterTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectMlbRosterTeamSeason') season: string;
  constructor(
    private rosterService: RosterService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.rosterService.setPreSelectedTeamSeason(this.season);
    }
  }
}
