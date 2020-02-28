
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';


// Environment
import {environment} from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private preSelectedTeamSeason: number;
  constructor(
    private http: TransferHttp
  ) { }

  getTeamNews(teamName: string, season?: string | number) {
    let params = new HttpParams();
    if (season) {
      params = params.append('season', season.toString());
    }
    const options = {
      params: params
    };
    const endpoint = `${environment.api_url}/mlb/fetch/news/team/${teamName}`;
    return this.http.get(endpoint, options).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getMatchupNews(teamNamesParam?, id?) {
    if (!teamNamesParam && !id) {
      return observableThrowError('Error getMatchupNews MLB, provide teamNamesParam or id')
    }
    let endpoint: string;
    if (id) {
      endpoint = `${environment.api_url}/mlb/fetch/news/matchup/${id}`;
    } else {
      endpoint = `${environment.api_url}/mlb/fetch/news/matchup/${teamNamesParam.split('-').join('/')}`;
    }
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getPreSelectedTeamSeason() {
    return this.preSelectedTeamSeason;
  }

  setPreSelectedTeamSeason(year: number | string) {
    this.preSelectedTeamSeason = parseInt((<string>year), 10);
  }

  removePreSelectedTeamSeason() {
    this.preSelectedTeamSeason = null;
  }
}

