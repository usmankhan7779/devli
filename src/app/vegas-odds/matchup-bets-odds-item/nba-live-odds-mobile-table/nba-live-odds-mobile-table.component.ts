import { Component, Input } from '@angular/core';
import { LiveOddsService } from '../../live-odds/live-odds.service';

@Component({
  selector: 'app-nba-live-odds-mobile-table',
  templateUrl: './nba-live-odds-mobile-table.component.html',
  styleUrls: ['../common-odds-mobile-table.scss']
})
export class NbaLiveOddsMobileTableComponent {
  @Input() ddData;
  @Input() matchup;
  constructor(
    public liveOddsService: LiveOddsService
  ) {}
}
