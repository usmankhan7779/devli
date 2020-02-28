
import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';

import {map} from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { NbaService } from '../nba.service';

@Injectable({
  providedIn: 'root'
})
export class NbaMatchupsService {
  indMatchupDataWasChanged = new Subject<any[]>();
  preSelectedMatchupId: string;
  constructor(
    private http: TransferHttp,
    private nbaService: NbaService
  ) { }

  getPreSelectedMatchupId() {
    return this.preSelectedMatchupId;
  }

  setPreSelectedMatchupId(id) {
    this.preSelectedMatchupId = id;
  }

  removePreSelectedMatchupId() {
    this.preSelectedMatchupId = '';
  }

  getTodayMatchups() {
    const endpoint = `${environment.api_url}/nba/fetch/matchups/gateway`;
    return this.http.get(endpoint).pipe(
      map((res: any) => {
        if (this.nbaService.forceOffseason) {
          res.data = [];
        }
        return res;
      }));
  }

  getMatchupByParams(year: string | number, month: string | number, day: string | number, away: string, home: string) {
    const endpoint = `${environment.api_url}/nba/fetch/matchups/${year}/${month}/${day}/${away}/${home}`;
    return this.http.get(endpoint).pipe(
      map((res: any) => res));
  }

  getMatchupById(id: string) {
    if (isNaN(Number(id))) {
      return observableThrowError({
        error: 'provide correct id!!'
      });
    }
    const endpoint = `${environment.api_url}/nba/fetch/matchups/${id}`;
    return this.http.get(endpoint).pipe(
      map((res: any) => res));
  }

  getMatchupByTeamNames(teamNames: string) {
    const endpoint = `${environment.api_url}/nba/fetch/matchups/${teamNames}`;
    return this.http.get(endpoint).pipe(
      map((res: any) => res));
  }


  sortMatchups(matchups) {
    matchups.sort((a, b) => {
      if (a.nav.matchup_time < b.nav.matchup_time) {
        return -1;
      }
      if (a.nav.matchup_time > b.nav.matchup_time) {
        return 1;
      }
      if (a.nav.matchup_time === b.nav.matchup_time) {
        if (a.game_id < b.game_id) {
          return -1;
        }
        if (a.game_id > b.game_id) {
          return 1;
        }
      }
      return 0;
    });
    const inProgressGames = matchups.filter(item => item.nav.status && item.nav.status.status === 'In Progress');
    const finalGames = matchups.filter(item => item.nav.status && item.nav.status.status === 'Final');
    const otherGames = matchups.filter(item => !item.nav.status ||
      (item.nav.status.status !== 'In Progress' &&  item.nav.status.status !== 'Final'));
    return [...inProgressGames, ...otherGames, ...finalGames];
  }

  changeIndMatchupData(data) {
    this.indMatchupDataWasChanged.next({...data});
  }
}
