
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ServerResponseService } from '../../shared/services/server-response.service';
import { Location } from '@angular/common';
import { RosterService } from './roster.service';
import * as _ from 'lodash';

@Injectable()
export class RosterResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private location: Location,
    private rosterService: RosterService,
    private serverResponseService: ServerResponseService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const path = this.location.path();
    if (route.params['team_name'] === 'st.-louis-cardinals') {
      const teamName = 'st-louis-cardinals';
      const redirectUrl = `/mlb/roster/${teamName}`;
      return this.serverResponseService.redirect(redirectUrl);
    }
    if (_.includes(path, 'active_year=') || _.includes(path, 'team_name=')) {
      const redirectUrl = `/mlb/roster/${route.params['team_name']}`;
      return this.serverResponseService.redirect(redirectUrl);
    }
    let _year: string | number;
    if (this.rosterService.getPreSelectedTeamSeason()) {
      _year = this.rosterService.getPreSelectedTeamSeason();
    }
    return this.rosterService.getRoster(route.params['team_name'], _year).pipe(
      catchError((err) => {
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
