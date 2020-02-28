
import {map} from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';


import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchupsService {
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
    const endpoint = `${environment.api_url}/nfl/fetch/matchups/gateway`;
    return this.http.get(endpoint).pipe(
      map((res: any) => res));
  }

  getMatchup(url: string) {
    const endpoint = `${environment.api_url}/nfl/fetch/matchups${url}`;
    return this.http.get(endpoint).pipe(
      map((res: any) => res));
  }

  getMatchupByGameKey(game_key: string) {
    const endpoint = `${environment.api_url}/nfl/fetch/matchups/${game_key}`;
    return this.http.get(endpoint).pipe(
      map((res: any) => res));
  }

  changeIndMatchupData(data) {
    this.indMatchupDataWasChanged.next({...data});
  }
}
