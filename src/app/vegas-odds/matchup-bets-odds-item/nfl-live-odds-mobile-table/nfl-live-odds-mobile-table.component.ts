import { Component, Input } from '@angular/core';
import { LiveOddsService } from '../../live-odds/live-odds.service';

@Component({
  selector: 'app-nfl-live-odds-mobile-table',
  templateUrl: './nfl-live-odds-mobile-table.component.html',
  styleUrls: ['../common-odds-mobile-table.scss']
})
export class NflLiveOddsMobileTableComponent {
  @Input() ddData;
  @Input() matchup;
  constructor(
    public liveOddsService: LiveOddsService
  ) {}
}
