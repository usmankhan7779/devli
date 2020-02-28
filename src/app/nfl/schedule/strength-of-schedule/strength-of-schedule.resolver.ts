
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ScheduleService } from '../schedule.service';
import { ServerResponseService } from '../../../shared/services/server-response.service';

@Injectable()
export class StrengthOfScheduleResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private location: Location,
    private scheduleService: ScheduleService,
    private serverResponseService: ServerResponseService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.scheduleService.getStrengthOfSchedule(route.params['year']).pipe(
      catchError(err => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = `/nfl/schedule/strength-of-schedule`;
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
