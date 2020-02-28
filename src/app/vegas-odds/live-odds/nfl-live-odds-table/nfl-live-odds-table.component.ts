import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LiveOddsService } from '../live-odds.service';

@Component({
  selector: 'app-nfl-live-odds-table',
  templateUrl: './nfl-live-odds-table.component.html',
  styleUrls: ['../common-odds-table.scss']
})
export class NflLiveOddsTableComponent {
  @Input() matchupsDate: any[];
  @Input() switchOptionNumber;
  @Input() ddData;
  @Input() switchOptions: any[];
  @Input() allBooksOption: string[];
  @Input() allBetsOption: string[];
  @Input() allAdditionalBooksOption: string[];
  @Input() activeLineMove: string;
  @Output() onLineMoveClick = new EventEmitter();
  constructor(
    public liveOddsService: LiveOddsService
  ) {}

  onLineClick(matchup) {
    this.onLineMoveClick.emit(matchup);
  }

  checkActiveChart(matchup) {
    return this.activeLineMove === this.liveOddsService.getMatchupId(matchup);
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
