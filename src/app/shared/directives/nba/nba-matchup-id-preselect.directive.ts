import { Directive, HostListener, Input } from '@angular/core';
import { NbaMatchupsService } from '../../../nba/matchups-gateway/matchups.service';

@Directive({
  selector: '[appNbaMatchupIdPreselect]'
})
export class NbaMatchupIdPreselectDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appNbaMatchupIdPreselect') gameId: number;

  constructor(
    private matchupsService: NbaMatchupsService
  ) { }


  @HostListener('click') onClick() {
    if (this.gameId) {
      this.matchupsService.setPreSelectedMatchupId(this.gameId);
    }
  }

}
