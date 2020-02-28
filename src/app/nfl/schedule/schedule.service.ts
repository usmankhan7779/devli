
import {throwError as observableThrowError,  Observable } from 'rxjs';
import * as _ from 'lodash';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import {environment} from '../../../environments/environment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { CommonService } from '../../shared/services/common.service';

@Injectable()
export class ScheduleService {
  private preSelectedTeamSeason = '';
  private preSelectedWeek = '';
  constructor(
    private http: TransferHttp,
    private commonService: CommonService
  ) { }

  getAvailableTabs(prop?) {
    return [
      {
        name: 'Preseason',
        prop: 2,
        available_weeks: 0,
        url: 'preseason-schedule',
        selected: prop === 2
      },
      {
        name: 'Regular',
        prop: 1,
        available_weeks: 17,
        url: '',
        selected: prop === 1
      },
      {
        name: 'Playoffs',
        prop: 3,
        available_weeks: 0,
        url: 'playoffs-schedule',
        selected: prop === 3
      }
    ]
  }

  getTabBy(value, propName) {
    return this.getAvailableTabs().find((tabItem) => {
      return value === tabItem[propName];
    });
  }

  getTabUrl(prop, addSlash = true, preSlash = false) {
    const tab = this.getAvailableTabs().find((tabItem) => {
      return prop === tabItem.prop;
    });
    if (tab && tab.url) {
      return (preSlash ? (addSlash ? '/' : '') : '') + tab.url + (!preSlash ? (addSlash ? '/' : '') : '');
    }
    return '';
  }

  getTabPropDependOnUrl(url) {
    if (typeof url === 'number') {
      return url;
    }
    if (!url) {
      return 1;
    }
    const tab = this.getAvailableTabs().find((tabItem) => {
      return url === tabItem.url;
    });
    return tab.prop;
  }

  fetchScheduleFor(year = 'current', seasonType): Observable<any> {
    const endpoint = `${environment.api_url}/nfl/fetch2/schedules/${year}/${this.getTabPropDependOnUrl(seasonType)}`;
    return this.http.get(endpoint).pipe(
      map(this.handleRes));
  }

  getOneWeekSchedule(week: string | number, year = 'current', seasonType) {
    let _week = week + '';
    if (_week && _.includes(_week, 'week-')) {
      _week = _week.replace(/week-/, '');
    }
    const endpoint = `${environment.api_url}/nfl/fetch2/schedules/week/${year}/${_week}/${this.getTabPropDependOnUrl(seasonType)}`;
    return this.http.get(endpoint).pipe(
      map(this.handleRes));
  }

  getStrengthOfSchedule(year?) {
    const endpoint = `${environment.api_url}/nfl/fetch/schedule/strength-of-schedule/${this.handleCurrentYear(year)}`;
    return this.http.get(endpoint).pipe(
      map(this.handleRes));
  }

  getTeamSchedule(teamName: string, year?) {
    const endpoint = `${environment.api_url}/nfl/fetch/schedules/team/${this.handleCurrentYear(year)}/${teamName}`;
    return this.http.get(endpoint).pipe(
      map((res) => {
        this.commonService.sortYearArr(res.seasons_dropdown);
        return res;
      }));
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

  getPreSelectedWeek() {
    return this.preSelectedWeek;
  }

  setPreSelectedWeek(week) {
    this.preSelectedWeek = week;
  }

  removePreSelectedWeek() {
    this.preSelectedWeek = '';
  }

  private handleCurrentYear(year) {
    let _year;
    if (year && isNaN(parseInt(year, 10))) {
      return observableThrowError('year should be integer');
    } else if (!year) {
      _year = 'current';
    } else {
      _year = year;
    }
    return _year;
  }

  private handleRes(res) {
    return res;
  }
}
