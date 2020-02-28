import { Component, Input } from '@angular/core';
import { LiveOddsService } from '../../live-odds/live-odds.service';

@Component({
  selector: 'app-mlb-live-odds-mobile-table',
  templateUrl: './mlb-live-odds-mobile-table.component.html',
  styleUrls: ['../common-odds-mobile-table.scss']
})
export class MlbLiveOddsMobileTableComponent {
  @Input() ddData;
  @Input() matchup;
  constructor(
    public liveOddsService: LiveOddsService
  ) {}
}
