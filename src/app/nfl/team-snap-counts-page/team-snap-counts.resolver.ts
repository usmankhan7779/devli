
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TeamSnapCountsService } from './team-snap-counts.service';
import { ServerResponseService } from '../../shared/services/server-response.service';


@Injectable()
export class TeamSnapCountsResolver implements Resolve<any> {
  constructor(
    private teamSnapCountsService: TeamSnapCountsService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const year = this.teamSnapCountsService.getPreSelectedTeamSeason();
    return this.teamSnapCountsService.getTeamSnapCounts(route.params['team_name'], year).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = `/nfl/snap-counts/${route.params['team_name']}`;
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
