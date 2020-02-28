
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { NflService } from '../nfl.service';
import { StatsService } from './stats.service';
import { TargetsService } from '../targets-gateway/targets.service';
import { ServerResponseService } from '../../shared/services/server-response.service';


@Injectable()
export class StatsResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private nflService: NflService,
    private targetsService: TargetsService,
    private statsService: StatsService,
    private serverResponseService: ServerResponseService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (route.params['year'] && route.params['type']) {
      const redirectUrl = `/nfl/player-stats/${route.params['type']}`;
      return this.serverResponseService.redirect(redirectUrl);
    }
    if (route.params['type'] === 'defense-players-stats') {
      const redirectUrl = '/nfl/player-stats/defensive-players-stats';
      return this.serverResponseService.redirect(redirectUrl);
    }
    return this.getStats(this.nflService.getPreSelectedLeagueSeason() || 'current', route.params['type']);
  }

  private getStats(year, type) {
    return new Observable(observer => {
      if (!type || !this.statsService.getAvailableStatsTypes()[type]) {
        this.router.navigate(['/404']);
        observer.next(null);
        return observer.complete();
      }
      return this.statsService.getStats(year, type).pipe(
        catchError(err => {
          this.router.navigate(['/404']);
          observer.next(null);
          observer.complete();
          return observableThrowError(err);
        }))
        .subscribe(res => {
          observer.next({
            data: res
          });
          return observer.complete();
        });
    })

  }
}

