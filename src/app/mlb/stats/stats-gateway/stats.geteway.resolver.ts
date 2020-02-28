
import {of as observableOf,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { StatsService } from '../stats.service';
import { ServerResponseService } from '../../../shared/services/server-response.service';


@Injectable()
export class StatsGatewayResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private serverResponseService: ServerResponseService,
    private statsService: StatsService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (route.data.redirect) {
      return this.serverResponseService.redirect(
        this.statsService.generateLeadersUrl('player-stats', route.params['statsLeague'], route.params['year'])
      );
    }
    return this.statsService.getLeaders(route.params['year'], route.params['statsLeague']).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          return this.serverResponseService.redirect(
            this.statsService.generateLeadersUrl('player-stats', route.params['statsLeague'])
          );
        }
        this.router.navigate(['/404']);
        return observableOf(null);
      }));
  }
}

