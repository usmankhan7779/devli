
import {of as observableOf, forkJoin as observableForkJoin,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { MatchupsService } from './matchups.service';
import { NflService } from '../nfl.service';
import * as _ from 'lodash';
import { ServerResponseService } from '../../shared/services/server-response.service';

const badRoutesRedirect = {
  'kansas-city-chiefs-indianapolis-colts': 'indianapolis-colts-kansas-city-chiefs',
  'oakland-raiders-minnesota-vikings': 'minnesota-vikings-oakland-raiders',
  'pittsburgh-steelers-baltimore-ravens': 'baltimore-ravens-pittsburgh-steelers',
  'pittsburgh-steelers-cincinnati-bengals': 'cincinnati-bengals-pittsburgh-steelers',
  'san-francisco-49ers-cincinnati-bengals': 'cincinnati-bengals-san-francisco-49ers',
  'san-francisco-49ers-cleveland-browns': 'cleveland-browns-san-francisco-49ers',
  'san-francisco-49ers-pittsburgh-steelers': 'pittsburgh-steelers-san-francisco-49ers',
  'tampa-bay-buccaneers-new-orleans-saints': 'new-orleans-saints-tampa-bay-buccaneers',
};

@Injectable()
export class SingleMatchupResolver implements Resolve<any> {
  constructor(
    private matchupsService: MatchupsService,
    private serverResponseService: ServerResponseService,
    private nflService: NflService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const url = `${route.params['team_names']}`;
    if (url && _.includes(Object.keys(badRoutesRedirect), url)) {
      return this.serverResponseService.redirect(`/nfl/matchups/${badRoutesRedirect[url]}`);
    }
    const gameKey = this.matchupsService.getPreSelectedMatchupId() || route.params['team_names'];
    this.matchupsService.removePreSelectedMatchupId();
    return observableForkJoin([this.matchupsService.getMatchupByGameKey(gameKey), this.nflService.getAvailableNflSeasons()]).pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return observableOf(null);
      }));
  }
}
