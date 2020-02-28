
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RosterService } from './roster.service';
import { ServerResponseService } from '../../shared/services/server-response.service';
import { CollegeFootballService } from '../college-football.service';
import { redirectRosterList } from './redirect-roster-list';
import * as _ from 'lodash';

@Injectable()
export class IndividualRosterResolver implements Resolve<any> {
  constructor(
    private collegeFootballService: CollegeFootballService,
    private rosterService: RosterService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (_.includes(redirectRosterList, route.params['team_name'])) {
      return this.serverResponseService.redirect('/college-football/rosters');
    }
    if (route.params['team_name'] === 'miami-%28oh%29-redhawks'
      || route.params['team_name'] === 'miami-(oh)-redhawks'
      || route.params['team_name'] === 'miami-') {
      return this.serverResponseService.redirect('/college-football/roster/miami-oh-redhawks');
    }
    let _year: string | number;
    if (this.collegeFootballService.getPreSelectedSeason()) {
      _year = this.collegeFootballService.getPreSelectedSeason();
    }
    return this.rosterService.getRoster(route.params['team_name'], _year).pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
