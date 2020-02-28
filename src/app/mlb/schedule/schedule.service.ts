
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';

import * as moment from 'moment';

import {environment} from '../../../environments/environment';

@Injectable()
export class ScheduleService {
  private preSelectedDate = '';
  private preSelectedTeamSeason = '';
  constructor(
    private http: TransferHttp
  ) { }

  fetchScheduleFor(startDate: string): Observable<any> {
    const startDateM = moment(startDate);
    const year = startDateM.get('year'), month = startDateM.get('month') + 1, day = startDateM.get('date');
    const endpoint = `${environment.api_url}/mlb/fetch/schedules/${year}/${month}-${day}`;

    return this.http.get(endpoint).pipe(
      map(this.extractData));
  }

  getTeamSchedule(teamName: string, year?) {
    let _year;
    if (year && isNaN(parseInt(year, 10))) {
      return observableThrowError('year should be integer');
    } else if (!year) {
      _year = 'current';
    } else {
      _year = year;
    }
    const endpoint = `${environment.api_url}/mlb/fetch/schedules/${_year}/${teamName}`;
    return this.http.get(endpoint).pipe(
      map(this.extractData));
  }

  getPreSelectedDate() {
    return this.preSelectedDate;
  }

  setPreSelectedDate(date) {
    this.preSelectedDate = date;
  }

  removePreSelectedDate() {
    this.preSelectedDate = '';
  }

  getPreSelectedTeamSeason() {
    return this.preSelectedTeamSeason;
  }

  setPreSelectedTeamSeason(year: string) {
    this.preSelectedTeamSeason = year;
  }

  removePreSelectedTeamSeason() {
    this.preSelectedTeamSeason = '';
  }

  setStartSeasonPreselectedDate(year: number) {
    switch (year) {
      case 2017: {
        this.setPreSelectedDate(`04-01-${year}`);
        break;
      }
      case 2018: {
        this.setPreSelectedDate(`03-29-${year}`);
        break;
      }
    }
  }

  // Private Functions
  // -----------------
  private extractData(body) {
    return body;
  }
}
