
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ScheduleService } from '../schedule.service';
import { ServerResponseService } from '../../../shared/services/server-response.service';
import * as _ from 'lodash';

const mlbRedirectList = [
  'chicago-cubs',
  'houston-astros'
];

@Injectable()
export class TeamScheduleResolver implements Resolve<any> {
  constructor(
    private scheduleService: ScheduleService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (_.includes(mlbRedirectList, route.params['team_name'])) {
      return this.serverResponseService.redirect(
        `/mlb/schedule/${route.params['team_name']}`
      );
    }
    let _year: string | number;
    if (this.scheduleService.getPreSelectedTeamSeason()) {
      _year = this.scheduleService.getPreSelectedTeamSeason();
    }
    return this.scheduleService.getTeamSchedule(route.params['team_name'], _year).pipe(
      catchError((err) => {
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
