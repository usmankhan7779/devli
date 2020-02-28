import { Directive, HostListener, Input } from '@angular/core';
import { MatchupsGatewayService } from '../../../mlb/matchups-gateway/matchups-gateway.service';

@Directive({
  selector: '[appMlbMatchupIdPreselect]'
})
export class MlbMatchupIdPreselectDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appMlbMatchupIdPreselect') gameId: number;

  constructor(
    private matchupsGatewayService: MatchupsGatewayService
  ) { }


  @HostListener('click') onClick() {
    if (this.gameId) {
      this.matchupsGatewayService.setPreSelectedMatchupId(this.gameId);
    }
  }

}
