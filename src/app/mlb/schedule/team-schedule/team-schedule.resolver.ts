
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ScheduleService } from '../schedule.service';
import { ServerResponseService } from '../../../shared/services/server-response.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';

@Injectable()
export class TeamScheduleResolver implements Resolve<any> {
  constructor(
    private scheduleService: ScheduleService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let _year: string | number;
    if (this.scheduleService.getPreSelectedTeamSeason()) {
      _year = this.scheduleService.getPreSelectedTeamSeason();
    }
    return this.scheduleService.getTeamSchedule(route.params['team_name'], _year).pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
