import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-matchup-win-prop-box',
  templateUrl: './matchup-win-prop-box.component.html',
  styleUrls: ['./matchup-win-prop-box.component.scss']
})
export class MatchupWinPropBoxComponent {
  @Input() status: any;
  @Input() singleTeam: string; // away or home
  @Input() likeRating: string | number;
  constructor(
  ) { }

  isWinner(): string {
    if (!this.status) {
      return;
    }
    return this.status.home_win_probability > this.status.away_win_probability ? 'home' : 'away';
  }

  getColor(prediction) {
    let currentClass = 'dark-red';
    if (prediction >= 71) {
      currentClass = 'dark-green';
    } else if (prediction >= 56) {
      currentClass = 'green';
    } else if (prediction >= 51) {
      currentClass = 'light-green';
    } else if (prediction === 50) {
      currentClass = 'yellow';
    } else if (prediction >= 41) {
      currentClass = 'light-red';
    } else if (prediction >= 35) {
      currentClass = 'red';
    }
    return 'box-bg-' + currentClass;
  }
}
