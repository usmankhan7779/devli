import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';


@Injectable()
export class PlayerRatingsService {

  constructor(
    private http: TransferHttp,
  ) {
  }


  getPlayers(league, page, queryParams: any) {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page.toString());
    }
    if (queryParams) {
      if (queryParams.teams) {
        params = params.append('team', queryParams.teams.join(',') || 'null');
      }
      if (queryParams.positions) {
        if (Array.isArray(queryParams.positions)) {
          params = params.append('position', queryParams.positions.join(',') || 'null');
        } else {
          params = params.append('position', queryParams.positions);
        }
      }
      if (queryParams.player) {
        params = params.append('player', queryParams.player.toLowerCase());
      }
      if (queryParams.sortBy) {
        params = params.append('sort_by', queryParams.sortBy);
      }
      if (queryParams.orderBy) {
        params = params.append('order_by', queryParams.orderBy);
      }
    }
    const options = {
      params: params
    };
    const endpoint = `${environment.api_url}/${league}/fetch/players`;
    return this.http.get(endpoint, options).pipe(
      map((response: any) => {
        if (response.results && response.results.length) {
          response.results = response.results.reduce((filtered: any[], player) => {
            switch (league) {
              case 'nba': {
                if (player.team_lineup_route && player.team_lineup_route.indexOf('nba/lineups') !== -1) {
                  player.team_depth_chart_route = player.team_lineup_route.replace('nba/lineups', 'nba/depth-charts');
                }
                break;
              }
              case 'mlb': {
                if (player.full_name === 'José Briceño' || player.full_name ===  'Aramís García') {
                  return filtered;
                }
                break;
              }
              case 'nfl': {
                if (player.name === 'Zeke Turner') {
                  return filtered;
                }
                if (player.team_depth_chart_route && player.team_depth_chart_route.indexOf('nfl/depth-charts') !== -1) {
                  // tslint:disable-next-line:max-line-length
                  player.team_snap_conts_route = player.team_depth_chart_route.replace('nfl/depth-charts', 'nfl/snap-counts') + '-snap-counts';
                }
                break;
              }
            }
            filtered.push(player);
            return filtered;
          }, []);
        }
        return response;
      }));
  }
}
