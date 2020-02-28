
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { StatsService } from '../stats.service';
import { NflService } from '../../nfl.service';


@Injectable()
export class StatsGatewayResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private statsService: StatsService,
    private nflService: NflService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const year = this.nflService.getPreSelectedLeagueSeason() || '';
    return new Observable(observer => {
      this.statsService.getLeaders(year).pipe(
        catchError(err => {
          this.router.navigate(['/404']);
          observer.next(null);
          observer.complete();
          return observableThrowError(err);
        }))
        .subscribe((leadersData) => {
          observer.next({
            ...leadersData,
            currentSeason: year || this.nflService.getDefaultSeason(leadersData.seasons_dropdown)
          });
          return observer.complete();
        });
    });
  }
}

