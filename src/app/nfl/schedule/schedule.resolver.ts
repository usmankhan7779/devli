
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ServerResponseService } from '../../shared/services/server-response.service';
import { Location } from '@angular/common';
import { ScheduleService } from './schedule.service';
import * as _ from 'lodash';

@Injectable()
export class ScheduleResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private location: Location,
    private scheduleService: ScheduleService,
    private serverResponseService: ServerResponseService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (_.includes(this.location.path(), 'schedule/2017;week=2017')) {
      const redirectUrl = '/nfl/schedule';
      return this.serverResponseService.redirect(redirectUrl);
    }
    if (_.includes(this.location.path(), 'week=')) {
      const redirectUrl = `/nfl/schedule/${route.params['week']}`;
      return this.serverResponseService.redirect(redirectUrl);
    }
    if (route.params['week']) {
      const seasonType = route.params['seasonType'] ? '/' + route.params['seasonType'] : '';
      const year = route.params['year'] ? '/' + route.params['year'] : '';
      const redirectUrl = `/nfl/schedule${seasonType}${year}`;
      return this.serverResponseService.redirect(redirectUrl);
    }
    const preselectedWeek = this.scheduleService.getPreSelectedWeek();
    let week: string;
    if (preselectedWeek && !route.params['week']) {
      week = `week-${preselectedWeek}`;
    } else {
      week = route.params['week'];
    }
    if (week) {
      const weekNum = parseInt(week.replace('week-', ''), 10);
      if (week === 'week-undefined' || weekNum > 17) {
        return this.serverResponseService.redirect('/nfl/schedule');
      }
      if (!/(week)-[1-9]/.test(week)) {
        this.router.navigate(['/404']);
        return EMPTY;
      }
      return this.scheduleService.getOneWeekSchedule(week, route.params['year'], route.params['seasonType']).pipe(
        catchError(err => {
          if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
            console.log('redirectError', err);
            const redirectUrl = `/nfl/schedule/${week}`;
            return this.serverResponseService.redirect(redirectUrl);
          }
          this.router.navigate(['/404']);
          return EMPTY;
        }))
    }
    return this.scheduleService.fetchScheduleFor(route.params['year'], route.params['seasonType']).pipe(
      catchError(err => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = `/nfl/schedule${route.params['seasonType'] ? '/' + route.params['seasonType'] : ''}`;
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
