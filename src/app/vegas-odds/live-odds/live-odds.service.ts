
import {map} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AngularFireLiteFirestore } from 'angularfire-lite';
import { Subject } from 'rxjs';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';


@Injectable()
export class LiveOddsService {
  dropDownsHasBeenUpdated = new Subject<any>();
  constructor(
    private http: TransferHttp,
    private firestore: AngularFireLiteFirestore,
  ) { }

  getLiveOdds(league: string) {
    const endpoint = `${environment.api_url}/${league}/fetch/live_odds`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getRealtimeLeagueOdds(league, id) {
    return this.firestore.read(`${league}_bets/${id}`).pipe(
      map((res) => {
        return res;
      }));
  }

  handleBetNameForTeam(betName, team): string {
    if (betName === 'Totals') {
      return 'total';
    }
    if (betName !== 'Over/Under') {
      return betName.toLowerCase();
    }
    if (team === 'home') {
      return 'under'
    }
    return 'over';
  }

  checkIfExists(value) {
    if (value !== null && value !== '' && value !== undefined) {
      return value.toString();
    }
    return false;
  }

  getMatchupId(matchup) {
    return new Date(matchup.date_time).getTime() + matchup.matchup_route;
  }

  triggerDDupdate(ddData) {
    this.dropDownsHasBeenUpdated.next({...ddData});
  }
}
