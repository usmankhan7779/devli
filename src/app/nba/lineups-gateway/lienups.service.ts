
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { environment } from 'environments/environment';

import { NbaService } from '../nba.service';
import * as _ from 'lodash';

@Injectable()
export class LineupsGatewayService {

  constructor(
    private http: TransferHttp,
    private nbaService: NbaService
  ) { }

  getNbaStartingLineups() {
    const endpoint = `${environment.api_url}/nba/fetch/lineups/gateway_new`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        if (this.nbaService.forceOffseason) {
          response.data = [];
        }
        return response;
      }));
  }

  getNbaStartingLineupsOdds() {
    return this.getNbaStartingLineups().pipe(
      map((response => {
        if (!response || !response.data || !response.data.length) {
          return {};
        }
        const result = {};
        response.data.forEach(game => {
          result[game.home_bets.key] = this.handleOddsFormat(game.home_bets);
          result[game.away_bets.key] = this.handleOddsFormat(game.away_bets);
        });
        return result;
      }))
    );
  }

  private handleOddsFormat(odds) {
    return {
      spread: odds.spread,
      total: odds.total,
      over_under: Number.parseFloat(odds.over_under.substr(1))
    }
  }

  getNbaLineupsRoutes() {
    const endpoint = `${environment.api_url}/nba/fetch/lineups/current`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }

  sortLineups(lineups) {
    lineups.sort((a, b) => {
      const a_date = new Date(a.game_info.home_nav.matchup_time); // new Date(new Date().getFullYear(), a.month, a.day);
      const b_date = new Date(b.game_info.home_nav.matchup_time); // new Date(new Date().getFullYear(), b.month, b.day);
      if (a_date < b_date) {
        return -1;
      }
      if (a_date > b_date) {
        return 1;
      }
      if (a_date === b_date) {
        if (a.game_info.game_key_id < b.game_info.game_key_id) {
          return -1;
        }
        if (a.game_info.game_key_id > b.game_info.game_key_id) {
          return 1;
        }
      }
      return 0;
    });
    const inProgressGames = lineups.filter(item => item.game_info.status && item.game_info.status.status === 'In Progress');
    const finalGames = lineups.filter(item => item.game_info.status && item.game_info.status.status === 'Final');
    const otherGames = lineups.filter(item => !item.game_info.status ||
      (item.game_info.status.status !== 'In Progress' && item.game_info.status.status !== 'Final'));
    return [...inProgressGames, ...otherGames, ...finalGames];
  }

  getStarters(lineups, depthCharts) {
    return depthCharts.map((dp: any) => {
      const matchup: any = this.getMatchupByAbbr(lineups, dp.team_fk.key);
      if (matchup.item) {
        const teamPlayers = `${matchup.isHome ? 'home' : 'away'}_players`;
        dp.starters = matchup.item[teamPlayers];
      }
      return dp;
    })
  }

  getMatchupByAbbr(lineups, abbr) {
    const res: any = {};
    let isHome = true;
    res.item = _.find(lineups, (o: any) => {
      if (o.game_info.away_nav.team_abbr === abbr) {
        isHome = false;
        return true;
      }
      return o.game_info.home_nav.team_abbr === abbr;
    });
    res['isHome'] = isHome;
    return res;
  }
}
