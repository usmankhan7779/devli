
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { NbaService } from '../nba.service';
import { ServerResponseService } from '../../shared/services/server-response.service';


@Injectable()
export class MinutesResolver implements Resolve<any> {
  constructor(
    private nbaService: NbaService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return new Observable(observer => {
      this.nbaService.getAvailableNBASeasons().pipe(
        catchError(err => {
          this.router.navigate(['/404']);
          observer.next(null);
          observer.complete();
          return observableThrowError(err);
        }))
        .subscribe(seasons => {
          if (!route.params['year'] || this.nbaService.checkAvailableSeason(route.params['year'], seasons)) {
            // const isCurrentSeason = this.nbaService.checkIfDefaultSeason(route.params['year'], seasons);
            observer.next({
              seasons: seasons.map(season => {
                return {
                  ...season,
                  name: this.nbaService.handleYear(season.year)
                }
              }),
              currentSeason: this.nbaService.getDefaultSeason(seasons)
            });
            return observer.complete();
          }
          this.router.navigate(['/404']);
          observer.next(null);
          return observer.complete();
        });
    });
  }
}
