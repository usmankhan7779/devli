
import {EMPTY,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ServerResponseService } from '../../shared/services/server-response.service';
import { NbaMatchupsService } from './matchups.service';
import * as _ from 'lodash';

const redirectToNBAMatchupsList = [
  'golden-state-warriors-denver-nuggets',
  'los-angeles-clippers-dallas-mavericks',
  'oklahoma-city-thunder-boston-celtics',
  'philadelphia-76ers-chicago-bulls',
  'portland-trail-blazers-los-angeles-lakers',
  'utah-jazz-atlanta-hawks'
];

@Injectable()
export class SingleMatchupResolver implements Resolve<any> {
  constructor(
    private matchupsService: NbaMatchupsService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const url = `${route.params['team_names']}`;
    if (_.includes(redirectToNBAMatchupsList, url)) {
      return this.serverResponseService.redirect('/nba/matchups');
    }
    let apiCall: Observable<any>;
    if (this.matchupsService.getPreSelectedMatchupId()) {
      apiCall = this.matchupsService.getMatchupById(this.matchupsService.getPreSelectedMatchupId());
      this.matchupsService.removePreSelectedMatchupId();
    } else {
      apiCall = this.matchupsService.getMatchupByTeamNames(url);
    }
    return apiCall.pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return EMPTY;
      }),
      map((res) => {
        if (typeof res === 'string') {
          return JSON.parse(res);
        }
        return res;
      }),);
  }
}
