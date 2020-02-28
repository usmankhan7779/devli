import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { map } from 'rxjs/operators';
import { MlbService } from '../mlb.service';

@Injectable()
export class FantasyProjectionsService {

  readonly colorConfig = {
    pointsPerK: {
      pitcher: [4.10, 4, 3.8, 3.6, 3.32, 3.1, 2.8, 2.5, 2.49],
      notPitcher: [3.6, 3.38, 2.83, 2.57, 2.3, 2.09, 1.8, 1.55, 1.54]
    },
    wind: {
      pitcher: [4.10, 4, 3.8, 3.6, 3.32, 3.1, 2.8, 2.5, 2.49],
      notPitcher: [3.6, 3.38, 2.83, 2.57, 2.3, 2.09, 1.8, 1.55, 1.54]
    },
    moneyline: [-200, -175, -150, -125, -110, 124, 149, 174, 175],
    team_runs: [2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.75, 5],
    theory: [9, 8, 7, 6, 5, 4, 3, 2, 1],
    opp_woba: [.290, .3, .310, .315, .320, .323, .327, .330, .331],
    opp_iso: [.120, .130, .140, .150, .160, .165, .175, .180, .181],
    iso: [.300, .250, .190, .170, .150, .140, .120, .100, .99],
    opp_k: [24, 23, 22, 21, 20, 19, 18, 17, 16.9],
    consistency: {
      pitcher: [60, 56, 50, 46, 41, 39, 35, 30, 29],
      notPitcher: [50, 46, 42, 38, 37, 36, 33, 32, 31]
    },
    woba: [.400, .370, .350, .340, .330, .315, .300, .280, .279],
    wrc: [160, 140, 125, 115, 100, 90, 80, 70, 69],
    opp_pitcher_hr_9: [1.8, 1.4, 1.2, 1.1, 1, 0.9, 0.8, 0.7, 0.69],
    opp_pitcher_k: [15.9, 17.9, 18.9, 19.9, 20.9, 21.9, 23.9, 26.9, 27]
  };

  constructor(
    private http: TransferHttp,
    private mlbService: MlbService
  ) { }

  getPlayers() {
    return this.http.get('https://mlbdata.dailyfantasycafe.com/api/players')
    // return of(this.players)
      .pipe(map(res => {
      const idList: number[] = [];
      res.data = (<any[]>res.data).reduce((filtered: any[], player: any) => {
        if (player.projections && player.projections.fanduel_cash &&
          player.projections.draftkings_cash && idList.indexOf(player.id) === -1) {
          if (player.opponent.indexOf('@') === 0) {
            player.opponent = player.opponent.slice(1);
          }
          player.spread = player.spread || '';
          player.theory = player.theory || '';
          player.over_under = player.over_under || '';

          const game = player.game.split(' @ ');
          player.home_team = game[1];
          player.away_team = game[0];
          player.fanduel_salary = player.salaries.fanduel[Object.keys(player.salaries.fanduel)[0]];
          player.draftkings_salary = player.salaries.draftkings[Object.keys(player.salaries.draftkings)[0]];
          (<any>player.fanduel_pointsPerK) = this.pointsPerK(player, 'fanduel');
          (<any>player.draftkings_pointsPerK) = this.pointsPerK(player, 'draftkings');


          player.profile_url = `/mlb/player-stats/${player.full_name.replace(/[^a-zA-Z ]/g, '').toLowerCase().split(' ').join('-')}`;

          try {
            player.away_url = this.getAwayTeamUrl(player);
            player.home_url = this.getHomeTeamUrl(player);
          } catch (err) {
            console.error(err);
            console.error('ERROR in Player: ');
            console.log(player);
          }

          filtered.push(player);
          idList.push(player.id);
        }
        return filtered;
      }, []);
      return res;
    }));
  }

  pointsPerK(player, fantasy) {
    const value = parseFloat((player.projections[fantasy + '_cash'] / (player[fantasy + '_salary'] / 1000)).toString());
    return value === 0 ? 0 : value.toFixed(2);
  }

  private getHomeTeamUrl(player) {
    return this.mlbService.mlbTeams[player.home_team].url;
  }
  private getAwayTeamUrl(player) {
    return this.mlbService.mlbTeams[player.away_team].url;
  }
}
