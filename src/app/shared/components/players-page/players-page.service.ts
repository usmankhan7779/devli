
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';


import {environment} from 'environments/environment';
import { HttpParams } from '@angular/common/http';
import { TransferHttp } from '../../../../modules/transfer-http/transfer-http';
import { NflService } from '../../../nfl/nfl.service';
import { NbaService } from '../../../nba/nba.service';
import { MlbService } from '../../../mlb/mlb.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersPageService {

  constructor(
    private http: TransferHttp,
    private nflService: NflService,
    private nbaService: NbaService,
    private mlbService: MlbService
  ) {
  }

  getTeamDropdown(league) {
    switch (league) {
      case 'nfl': {
        return this.nflService.nflTeams;
      }
      case 'nba': {
        return this.nbaService.nbaTeams;
      }
      case 'mlb': {
        return this.mlbService.mlbTeams;
      }
    }
  }

  getPlayers(mode = 'nfl', page, queryParams: any) {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page.toString());
    }
    if (queryParams) {
      if (queryParams.teams) {
        params = params.append('team', queryParams.teams.join(',') || 'null');
      }
      if (queryParams.positions) {
        params = params.append('position', queryParams.positions.join(',') || 'null');
      }
      // if (queryParams.itemsPerPage) {
      //   params = params.append('page_size', queryParams.itemsPerPage);
      // }
      // if (queryParams.year) {
      //   params = params.append('year', queryParams.year);
      // }
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
    const endpoint = `${environment.api_url}/${mode}/fetch/players`;
    return this.http.get(endpoint, options).pipe(
      map((response: any) => {
        if (mode === 'cfb' && response && response.results && response.results.length) {
          response.results.forEach(player => {
            if (player.team_roster_route === '/college-football/roster/miami-(oh)-redhawks') {
              player.team_roster_route = '/college-football/roster/miami-oh-redhawks';
            }
          });
        }
        return response;
      }));
  }
}
