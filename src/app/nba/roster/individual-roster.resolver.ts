
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RosterService } from './roster.service';
import { ServerResponseService } from '../../shared/services/server-response.service';
import * as _ from 'lodash';

const mlbRedirectList = [
  'chicago-cubs',
  'houston-astros'
];

@Injectable()
export class IndividualRosterResolver implements Resolve<any> {
  constructor(
    private rosterService: RosterService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (_.includes(mlbRedirectList, route.params['team_name'])) {
      return this.serverResponseService.redirect(
        `/mlb/roster/${route.params['team_name']}`
      );
    }
    let _year: string | number;
    if (this.rosterService.getPreSelectedTeamSeason()) {
      _year = this.rosterService.getPreSelectedTeamSeason();
    }
    return this.rosterService.getRoster(route.params['team_name'], _year).pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
