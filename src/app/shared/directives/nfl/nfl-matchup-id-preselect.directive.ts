import { Directive, HostListener, Input } from '@angular/core';
import { MatchupsService } from '../../../nfl/matchups-gateway/matchups.service';

@Directive({
  selector: '[appNflMatchupIdPreselect]'
})
export class NflMatchupIdPreselectDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appNflMatchupIdPreselect') gameId: number;

  constructor(
    private matchupsService: MatchupsService
  ) { }


  @HostListener('click') onClick() {
    if (this.gameId) {
      this.matchupsService.setPreSelectedMatchupId(this.gameId);
    }
  }

}
