
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { environment } from 'environments/environment';


@Injectable()
export class LineupsGatewayService {

  constructor(
    private http: TransferHttp
  ) { }

  mlbStartingLineups() {
    const endpoint = `${environment.api_url}/mlb/fetch/lineups/gateway`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }

  mlbStartingLineupsRoutes() {
    const endpoint = `${environment.api_url}/mlb/fetch/lineups/current`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }

  sortLineups(lineups) {
    lineups.sort((a, b) => {
      if (a.data.date_time < b.data.date_time) {
        return -1;
      }
      if (a.data.date_time > b.data.date_time) {
        return 1;
      }
      if (a.data.date_time === b.data.date_time) {
        if (a.data.game_id < b.data.game_id) {
          return -1;
        }
        if (a.data.game_id > b.data.game_id) {
          return 1;
        }
      }
      return 0;
    });
    // Sort Hitters by Batting Order
    lineups.forEach(lineup => {
      // Sort Home Team
      lineup.data.home_team.hitters.sort((a, b) => {
        if (a.batting_order < b.batting_order) {
          return -1;
        }
        if (a.batting_order > b.batting_order) {
          return 1;
        }
        return 0;
      });
      // Sort Away Team
      lineup.data.away_team.hitters.sort((a, b) => {
        if (a.batting_order < b.batting_order) {
          return -1;
        }
        if (a.batting_order > b.batting_order) {
          return 1;
        }
        return 0;
      });
    });
    const inProgressGames = lineups.filter(item => item.data.status && item.data.status.status === 'In Progress');
    const finalGames = lineups.filter(item => item.data.status && item.data.status.status === 'Final');
    const otherGames = lineups.filter(item => !item.data.status ||
      (item.data.status.status !== 'In Progress' &&  item.data.status.status !== 'Final'));
    return [...inProgressGames, ...otherGames, ...finalGames];
  }
}
