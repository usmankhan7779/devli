import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-in-game-predictor',
  templateUrl: './in-game-predictor.component.html',
  styleUrls: ['./in-game-predictor.component.scss']
})
export class InGamePredictorComponent implements OnInit {
  pageNavOpen: boolean;
  availableTabs = [
    'Live Game',
    'Pregame',
    'Bets',
    'Box Score'
  ];

  activeTab = this.availableTabs[0];

  constructor() { }

  ngOnInit() {
  }

  onTabClick(tab: string) {
    this.activeTab = tab;
  }
}
