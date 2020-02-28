import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-score-prediction-table',
  templateUrl: './score-prediction-table.component.html',
  styleUrls: ['./score-prediction-table.component.scss']
})
export class ScorePredictionTableComponent implements OnInit {
  @Input() league: string;
  @Input() awayLogo: string;
  @Input() awayTeamName: string;
  @Input() awayFirstHalfScorePrediction: string;
  @Input() awayFinalScorePrediction: string;
  @Input() homeLogo: string;
  @Input() homeTeamName: string;
  @Input() homeFirstHalfScorePrediction: string;
  @Input() homeFinalScorePrediction: string;
  @Input() showAt = false;

  constructor() { }

  ngOnInit() {
  }

}
