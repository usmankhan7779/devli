
import {of as observableOf,  Observable } from 'rxjs';
import * as _ from 'lodash';
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { StatsService } from './stats.service';
import { ServerResponseService } from '../../shared/services/server-response.service';


@Injectable()
export class StatsResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private serverResponseService: ServerResponseService,
    private statsService: StatsService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (route.data.redirect) {
      return this.serverResponseService.redirect(
        this.statsService.generateLeadersUrl(route.params['statsType'], route.params['statsLeague'], route.params['year'])
      );
    }
    if (route.params['year'] && !(route.params['year'].length === 4 && parseInt(route.params['year'], 10).toString().length === 4)) {
      this.router.navigate(['/404']);
    }
    const queryParams = this.statsService.getSavedDDs();
    if (queryParams && queryParams.positions &&
      (!this.statsService.statsTypes[route.params['statsType']] ||
        !_.includes(this.statsService.statsTypes[route.params['statsType']], queryParams.positions[0]))
    ) {
      delete queryParams.positions;
    }
    this.statsService.removeSavedDDs();
    return this.statsService.getStats(route.params['year'], route.params['statsLeague'], route.params['statsType'], queryParams).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          return this.serverResponseService.redirect(
            this.statsService.generateLeadersUrl(route.params['statsType'], route.params['statsLeague'])
          );
        }
        this.router.navigate(['/404']);
        return observableOf(null);
      }));
  }
}
