
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RosterService } from './roster.service';
import { ServerResponseService } from '../../shared/services/server-response.service';
import { NBAteamList } from '../../nba/teams/team-list';
import * as _ from 'lodash';

@Injectable()
export class RosterResolver implements Resolve<any> {
  constructor(
    private rosterService: RosterService,
    private router: Router,
    private serverResponseService: ServerResponseService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (route.params['team_name'] && _.includes(NBAteamList, route.params['team_name'])) {
      const redirectUrl = `/nba/roster/${route.params['team_name']}`;
      return this.serverResponseService.redirect(redirectUrl);
    }
    if (route.params['team_name'] === 'denver') {
      const redirectUrl = '/nfl/roster/denver-broncos';
      return this.serverResponseService.redirect(redirectUrl);
    }
    if (!_.isEmpty(route.url && route.url[1] && route.url[1].parameters)) {
      const redirectUrl = `/nfl/roster/${route.params['team_name']}`;
      return this.serverResponseService.redirect(redirectUrl);
    }
    let _year: string | number;
    if (this.rosterService.getPreSelectedTeamSeason()) {
      _year = this.rosterService.getPreSelectedTeamSeason();
    }
    return this.rosterService.getRoster(route.params['team_name'], _year).pipe(
      catchError(err => {
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
