import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-betting-card',
  templateUrl: './betting-card.component.html',
  styleUrls: ['./betting-card.component.scss'],
  providers: [NgbPopoverConfig]
})
export class BettingCardComponent implements OnInit {
  @Input() topLeftHeading = 'Base Prediction';
  @Input() cardType: number;
  @Input() additionalInfo: string;
  @Input() awayProbability: number;
  @Input() homeProbability: number;
  @Input() bets: any;
  @Input() hidePM = false;
  @Input() noCardSave: number = null;

  @Input() set title(val) {
    if (val !== this._title) {
      this._title = val;
      this.index = 0; // reset active bets
    }
  };
  @Input() set index(index) {
    this.selectedBet = null;
    this.selectedBetTeam = null;
  }

  @Output() cardSaved = new EventEmitter();
  @Output() predictorClick = new EventEmitter();

  _title: string;
  selectedBet = null;
  selectedBetTeam = null;
  constructor(config: NgbPopoverConfig) {
    config.placement = 'bottom';
    config.triggers = 'hover';
  }

  ngOnInit() {
    this.bets.forEach((item) => {
      if (item.home && item.home.saved) {
        this.onBetClick(item, 'home')
      } else if (item.away && item.away.saved) {
        this.onBetClick(item, 'away')
      }
    });
  }

  onCardSaveClick() {
    this.selectedBetTeam.saved = !this.selectedBetTeam.saved;
    this.cardSaved.emit(this.selectedBetTeam);
  }

  onPredictorClick() {
    this.predictorClick.emit(this.noCardSave);
  }

  onBetClick(betItem: any, team: string) {
    if (betItem.book !== 'Lineups.com') {
      this.selectedBet = betItem;
      this.selectedBetTeam = betItem[team];
    }
  }
}
