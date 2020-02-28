import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { PlusPipe } from '../../pipes/plus.pipe';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-lineup',
  templateUrl: './lineup.component.html',
  styleUrls: ['./lineup.component.scss'],
  providers: [PlusPipe]
})
export class LineupComponent implements OnInit {
  @Input() mode: string; // nfl / mlb
  @Input() lineupData: any;
  hitters: any[];
  players: any[];
  isBrowser: boolean;

  constructor(
    private plusPipe: PlusPipe,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    switch (this.mode) {
      case 'mlb': {
        this.hitters = this.createPlayersArr(this.lineupData.home_team.hitters, this.lineupData.away_team.hitters);
        break;
      }
      case 'nfl': {
        this.players = this.createPlayersArr(this.lineupData.home.players, this.lineupData.away.players);
        break;
      }
      case 'nba': {
        this.players = this.createPlayersArr(this.lineupData.home.players, this.lineupData.away.players);
        break;
      }
    }
  }

  createPlayersArr(home_players, away_players) {
    const resArr = [];
    const sortedHomePlayers = home_players.sort(this.sortingByOrder);
    const sortedAwayPlayers = away_players.sort(this.sortingByOrder);
    for (let i = 0; i < sortedHomePlayers.length; i++) {
      resArr.push({
        home_player: sortedHomePlayers[i] || {},
        away_player: sortedAwayPlayers[i] || {}
      });
    }
    return resArr;
  }

  getTeamUrl(team: string) {
    switch (this.mode) {
      case 'mlb': {
        return this.lineupData[team + '_team'].lineup_route;
      }
      case 'nfl': {
        return this.lineupData[team + '_depth_chart_route'];
      }
      case 'nba': {
        return this.lineupData[team].lineups_route;
      }
    }
  }

  allowShortNames() {
    return this.isBrowser && window.innerWidth < 1467;
  }

  getTeamName(team: string) {
    switch (this.mode) {
      case 'mlb': {
        return this.lineupData[team + '_team'].full_name;
      }
      case 'nfl': {
        return this.lineupData[team].name;
      }
      case 'nba': {
        return this.lineupData[team].name;
      }
    }
  }

  getTeamLogo(team: string) {
    switch (this.mode) {
      case 'mlb': {
        return 'assets/images/' + this.mode + '/logos/bordered/' + this.lineupData[team + '_team'].route  + '-largest.svg'
      }
      case 'nfl': {
        return 'assets/images/' + this.mode + '/logos/bordered/' + this.lineupData[team].route + '-largest.svg'
      }
      case 'nba': {
        return 'assets/images/' + this.mode + '/logos/bordered/' + this.lineupData[team].route + '.svg'
      }
    }
  }

  getTeamDetails(team: string) {
    switch (this.mode) {
      case 'mlb': {
        // tslint:disable-next-line:max-line-length
        return `${this.lineupData[team + '_team'].total} Runs, ${this.plusPipe.transform(this.lineupData[team + '_team'].spread)} ${this.plusPipe.transform(this.lineupData[team + '_team'].moneyline)}`;
      }
      case 'nfl': {
        // tslint:disable-next-line:max-line-length
        return `${this.lineupData[team].total} pts, ${this.plusPipe.transform(this.lineupData[team].spread)} ${this.plusPipe.transform(this.lineupData[team].moneyline)}`;
      }
      case 'nba': {
        // tslint:disable-next-line:max-line-length
        return `${this.lineupData[team].total} pts, ${this.plusPipe.transform(this.lineupData[team].spread)} ${this.plusPipe.transform(this.lineupData[team].moneyline)}`;
      }
    }
  }

  showDT() {
    return this.isBrowser;
  }

  private sortingByOrder(a, b) {
    return (a.order - b.order);
  }
}
