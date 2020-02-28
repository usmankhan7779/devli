
import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';


import { environment } from 'environments/environment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { CommonService } from '../../shared/services/common.service';

@Injectable()
export class TeamLineupService {
  private preSelectedTeamSeason: number;
  indTeamDataWasChanged = new Subject<any>();

  constructor(
    private http: TransferHttp,
    private commonService: CommonService
  ) { }

  mlbTeamLineup(teamNameValue, year?) {
    let _year;
    if (year && isNaN(parseInt(year, 10))) {
      return observableThrowError('year should be integer');
    } else if (!year) {
      _year = 'current';
    } else {
      _year = year;
    }
    const endpoint = `${environment.api_url}/mlb/fetch/lineups/${_year}/${teamNameValue}`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        this.commonService.sortYearArr(response.seasons_dropdown);
        return response;
      }));
  }

  changeIndTeamData(data: any, year?: string, heading?) {
    this.indTeamDataWasChanged.next({
      data: {
        ...data
      },
      year,
      heading
    });
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
