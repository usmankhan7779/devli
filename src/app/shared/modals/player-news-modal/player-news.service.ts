
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { environment } from 'environments/environment';
import { TransferHttp } from '../../../../modules/transfer-http/transfer-http';

@Injectable({
  providedIn: 'root'
})
export class PlayerNewsService {

  constructor(
    private http: TransferHttp
  ) { }


  getMLBPlayerNews(playerId: string | number) {
    const endpoint = `${environment.api_url}/mlb/fetch/news/players/${playerId}`;
    return this.http.get(endpoint).pipe(
      map((res: any) => res));
  }

  getNFLPlayerNews(playerId: string | number) {
    const endpoint = `${environment.api_url}/nfl/fetch/news/players/${playerId}`;
    return this.http.get(endpoint).pipe(
      map((res: any) => res));
  }

  getNBAPlayerNews(playerId: string | number) {
    const endpoint = `${environment.api_url}/nba/fetch/news/players/${playerId}`;
    return this.http.get(endpoint).pipe(
      map((res: any) => res));
  }
}
