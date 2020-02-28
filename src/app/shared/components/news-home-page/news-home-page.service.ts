
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { TransferHttp } from '../../../../modules/transfer-http/transfer-http';
import { HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class NewsHomePageService {

  constructor(
    private http: TransferHttp
  ) { }

  getAllTeamNews(league, page, pageSize, playerName?) {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page.toString());
    }
    if (pageSize) {
      params = params.append('page_size', pageSize);
    }
    const options = {
      params: params
    };
    const endpoint = `${environment.api_url}/${league}/fetch/news`;
    if (playerName) {
      return this.http.post(endpoint, {
        'player': playerName
      }, options).pipe(
        map((response: any) => {
          return response;
        }));
    }
    return this.http.get(endpoint, options).pipe(
      map((response: any) => {
        return response;
      }));
  }
}
