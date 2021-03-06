import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LiveOddsService } from '../live-odds.service';

@Component({
  selector: 'app-mlb-live-odds-table',
  templateUrl: './mlb-live-odds-table.component.html',
  styleUrls: ['../common-odds-table.scss']
})
export class MlbLiveOddsTableComponent {
  @Input() matchupsDate: any[];
  @Input() switchOptionNumber;
  @Input() ddData;
  @Input() switchOptions: any[];
  @Input() allBooksOption: string[];
  @Input() allAdditionalBooksOption: string[];
  @Input() allBetsOption: string[];
  @Input() activeLineMove: string;
  @Output() onLineMoveClick = new EventEmitter();
  constructor(
    public liveOddsService: LiveOddsService
  ) {}

  onLineClick(matchup) {
    this.onLineMoveClick.emit(matchup);
  }

  checkActiveChart(matchup) {
    if (matchup) {
      return this.activeLineMove === this.liveOddsService.getMatchupId(matchup);
    }
    return false;
  }

  getTdChartLength() {
    switch (this.switchOptionNumber) {
      case this.switchOptions[0]: {
        return 5 * this.allBooksOption.length + 5;
      }
      case this.switchOptions[1]: {
        return 4 * this.allBooksOption.length + 5;
      }
      case this.switchOptions[2]: {
        return 4 * this.ddData.activeBets.length + 5
      }
    }
  }
}
