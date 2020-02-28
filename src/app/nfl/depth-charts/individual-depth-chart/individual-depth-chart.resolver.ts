
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
    if (route.params['team_name'] === 'washington-redskin') {
      return this.serverResponseService.redirect('/nfl/depth-charts/washington-redskins');
    }
    if (route.params['team_name'] === 'oakland') {
      return this.serverResponseService.redirect('/nfl/depth-charts/oakland-raiders');
    }
    if (route.params['team_name'] === 'baltimore-ravents') {
      return this.serverResponseService.redirect('/nfl/depth-charts/baltimore-ravens');
    }
    if (route.params['team_name'] === 'houstan-texans') {
      return this.serverResponseService.redirect('/nfl/depth-charts/houston-texans');
    }
    let _year: string | number;
    if (this.depthChartService.getPreSelectedTeamSeason()) {
      _year = this.depthChartService.getPreSelectedTeamSeason();
    }
    return this.depthChartService.getIndividualDepthChart(route.params['team_name'], _year).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = `/nfl/depth-charts/${route.params['team_name']}`;
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
