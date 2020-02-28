
import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';

import {map} from 'rxjs/operators';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MatchupsGatewayService {
  indMatchupDataWasChanged = new Subject<any[]>();
  private preSelectedMatchupId: string;

  constructor(
    private http: TransferHttp
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
    const endpoint = `${environment.api_url}/mlb/fetch/matchups/gateway`;
    return this.http.get(endpoint).pipe(
      map(this.extractData))
  }

  getSingleMatchup(teamNames: string) {
    if (!isNaN(Number(teamNames))) {
      return observableThrowError({
        error: 'provide correct team name'
      });
    }
    const endpoint = `${environment.api_url}/mlb/fetch/matchups/${teamNames}`;
    return this.http.get(endpoint).pipe(
      map(this.extractData));
  }

  getMatchupById(id: string) {
    if (isNaN(Number(id))) {
      return observableThrowError({
        error: 'provide correct id!!'
      });
    }
    const endpoint = `${environment.api_url}/mlb/fetch/matchups/${id}`;
    return this.http.get(endpoint).pipe(
      map(this.extractData));
  }

  private extractData(body: any) {
    return body;
  }

  sortMatchups(matchups) {
    matchups.sort((a, b) => {
      if (moment(a.nav.matchup_time).valueOf() < moment(b.nav.matchup_time).valueOf()) {
        return -1;
      }
      if (moment(a.nav.matchup_time).valueOf() > moment(b.nav.matchup_time).valueOf()) {
        return 1;
      }
      if (moment(a.nav.matchup_time).valueOf() === moment(b.nav.matchup_time).valueOf()) {
        if (a.game_id < b.game_id) {
          return -1;
        }
        if (a.game_id > b.game_id) {
          return 1;
        }
      }
      return 0;
    });
    const inProgressGames = matchups.filter(item => item.status && item.status.status === 'In Progress');
    const finalGames = matchups.filter(item => item.status && item.status.status === 'Final');
    const otherGames = matchups.filter(item => !item.status ||
      (item.status.status !== 'In Progress' &&  item.status.status !== 'Final'));
    return [...inProgressGames, ...otherGames, ...finalGames];
  }

  changeIndMatchupData(data) {
    this.indMatchupDataWasChanged.next({...data});
  }
}
