import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../lib/game';

interface Info {
  teams: {
    color: string;
    teamInfo: Array<string | number>,
    passing: Array<string | number>[],
    rushing: Array<string | number>[],
    receiving: Array<string | number>[]
  }[];
}

@Component({
  selector: 'app-box-score',
  templateUrl: './box-score.component.html',
  styleUrls: ['./box-score.component.scss']
})
export class BoxScoreComponent implements OnInit {

  private _game: Game;
  @Input()
  set game(value: Game) {
    this._game = value;
    this.buildInfo();
  }
  get game() { return this._game; }

  info: Info;

  constructor() { }

  ngOnInit() {
  }

  private buildInfo() {
    const info: any = {
      teams: []
    };

    info.teams.push(this.buildForTeam(this._game.data.box_score.away, this._game.colors[this._game.awayTeam]));
    info.teams.push(this.buildForTeam(this._game.data.box_score.home, this._game.colors[this._game.homeTeam]));

    this.info = info;
  }

  private buildForTeam(values: any[], color: string) {
    const sections = ['passing', 'rushing', 'receiving'];
    let index = 0;
    const teamVals: any = {
      teamInfo: values[0],
      color
    };

    for (let i = 1; i < values.length; i++) {
      if (!teamVals[sections[index]]) {
        teamVals[sections[index]] = [];
      }
      teamVals[sections[index]].push(values[i]);

      if (values[i][0] === 'Total') {
        index++;
      }
    }

    return teamVals;
  }

}
