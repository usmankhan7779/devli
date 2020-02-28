
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';


// Environment
import { environment } from '../../../environments/environment';
import { CommonService } from '../../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  private preSelectedTeamSeason: number;
  constructor(
    private http: TransferHttp,
    private commonService: CommonService
  ) { }

  getRoster(teamName: string, year?) {
    let _year;
    if (year && isNaN(parseInt(year, 10))) {
      return observableThrowError('year should be integer');
    } else if (!year) {
      _year = 'current';
    } else {
      _year = year;
    }
    const endpoint = `${environment.api_url}/nba/fetch/roster/${_year}/${teamName}`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        this.commonService.sortYearArr(response.seasons_dropdown);
        return response;
      }));
  }

  getRosterRoutes(year?: string | number) {
    let yearParam = '';
    if (year) {
      yearParam = `/${year}`
    }
    const endpoint = `${environment.api_url}/nba/fetch/rosters${yearParam}`;
    return this.http.get(endpoint).pipe(
      map((res: any) => {
        return res;
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

