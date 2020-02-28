
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../shared/services/common.service';


@Injectable()
export class ScheduleService {
  private preSelectedDate = '';
  private preSelectedTeamSeason = '';
  constructor(
    private http: TransferHttp,
    private commonService: CommonService
  ) { }

  fetchScheduleFor(startDate: string, isWeekSchedule = true): Observable<any> {
    const momentStartDate = moment(startDate);
    const year = momentStartDate.get('year');
    const  month = momentStartDate.get('month') + 1; // + 1 to get current month
    const  day = momentStartDate.get('date');
    const endpoint = `${environment.api_url}/nba/fetch/schedules/${isWeekSchedule ? 'week/' : ''}${year}/${month}/${day}`;

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
    const endpoint = `${environment.api_url}/nba/fetch/schedules/team/${_year}/${teamName}`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        this.commonService.sortYearArr(response.seasons_dropdown);
        return response;
      }));
  }

  setStartSeasonPreselectedDate(year: number) {
      switch (year) {
        case 2017: {
          this.setPreSelectedDate(`10-25-${year - 1}`);
          break;
        }
        case 2018: {
          this.setPreSelectedDate(`10-17-${year - 1}`);
          break;
        }
      }
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

  private extractData(body) {
    return body;
  }
}
