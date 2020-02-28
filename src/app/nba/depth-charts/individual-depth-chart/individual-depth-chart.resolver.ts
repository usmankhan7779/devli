
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { DepthChartService } from '../depth-chart.service';
import { ServerResponseService } from '../../../shared/services/server-response.service';


@Injectable()
export class IndividualDepthChartResolver implements Resolve<any> {
  constructor(
    private depthChartService: DepthChartService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const year = this.depthChartService.getPreSelectedTeamSeason();
    return this.depthChartService.getIndividualDepthChart(route.params['team_name'], year).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = `/nba/depth-charts/${route.params['team_name']}`;
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
