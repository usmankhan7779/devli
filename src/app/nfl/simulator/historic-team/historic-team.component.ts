import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-historic-team',
  templateUrl: './historic-team.component.html',
  styleUrls: ['./historic-team.component.scss']
})
export class HistoricTeamComponent implements OnInit {
  @Input() dropdowns: any;
  @Input() data: any;
  @Input() resultData: any;
  @Input() activeView: any;

  readonly playerTypeArray: string[] = [
    'passing',
    'rushing',
    'receiving',
    'kicking',
    'defense'
  ];

  countoConfig = {
    step: 100,
    countFrom: 0,
    duration: 3,
  };

  countoAnimation = {
    simulations_run: 0,
    away_team_wins: 0,
    away_team_win_percent: 0,
    home_team_wins: 0,
    home_team_win_percent: 0,
    overtimes: 0,
    overtime_percent: 0,
    away_team_wins_by_10: 0,
    away_team_wins_by_10_percent: 0,
    home_team_wins_by_10: 0,
    home_team_wins_by_10_percent: 0
  };

  constructor() { }

  ngOnInit() {
  }

  getEmptyRows(team, tableType): any[] {
    let oppTeam;
    if (team === 'home') {
      oppTeam = 'away';
    } else {
      oppTeam = 'home';
    }
    const teamPlayersLength = this.resultData[team + '_' + tableType][0].length;
    const oppPlayersLength = this.resultData[oppTeam + '_' + tableType][0].length;
    if (teamPlayersLength === oppPlayersLength || teamPlayersLength > oppPlayersLength) {
      return new Array(0);
    }
    return new Array(oppPlayersLength - teamPlayersLength);
  }

  getMaxPlayerLengthArray(tableType): 'home' | 'away' {
    const homeTeamPlayersLength = this.resultData['home' + '_' + tableType][0].length;
    const awayTeamPlayersLength = this.resultData['away' + '_' + tableType][0].length;
    return homeTeamPlayersLength > awayTeamPlayersLength ? 'home' : 'away';
  }

  getOpponentTeam(team: 'home'| 'away') {
    return team === 'home' ? 'away' : 'home';
  }

}
