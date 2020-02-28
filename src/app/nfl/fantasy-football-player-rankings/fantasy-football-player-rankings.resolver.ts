
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { FantasyFootballPlayerRankingsService } from './fantasy-football-player-rankings.service';

@Injectable()
export class FantasyFootballPlayerRankingsResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private fantasyFootballPlayerRankingsService: FantasyFootballPlayerRankingsService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let itemsPerPage = 25;
    if ('team-defense-dst' === route.params['type']) {
      itemsPerPage = null;
    } else if (route.params['type'] === 'defensive-player-idp' || !route.params['type']) {
      itemsPerPage = 50
    }
    return this.fantasyFootballPlayerRankingsService.getFantasyData(
      null,
      this.fantasyFootballPlayerRankingsService.getPositionKey(route.params['type']),
      undefined,
      itemsPerPage
    ).pipe(
      catchError(err => {
        this.router.navigate(['/404']);
        return EMPTY;
      }))
  }
}
