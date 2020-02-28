
import {of as observableOf,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TeamService } from '../team.service';
import { CommonService } from '../../../shared/services/common.service';
import { ServerResponseService } from '../../../shared/services/server-response.service';
import { NflService } from '../../nfl.service';
import * as _ from 'lodash';

@Injectable()
export class TeamRankingsResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private commonService: CommonService,
    private serverResponseService: ServerResponseService,
    private nflService: NflService,
    private teamService: TeamService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (route.params['type'] && !_.includes(this.teamService.availableTeamRankings, route.params['type'])) {
      this.router.navigate(['/404']);
      return observableOf(null);
    }
    const savedDDs = this.teamService.getSavedDD(true);
    let queryParams: any;
    if (savedDDs && savedDDs.conferenceDropdown && savedDDs.conferenceDropdown.length) {
      queryParams = {
        conference: this.commonService.getActiveCheckBoxItems(savedDDs.conferenceDropdown, 'id')[0],
        division: this.commonService.getActiveCheckBoxItems(savedDDs.divisionDropdown, 'id')[0]
      };
    }
    const year = this.nflService.getPreSelectedLeagueSeason() || 'current';
    return this.teamService.getTeamRankingsData(year, route.params['type'], queryParams).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = `/nfl-team-rankings${route.params['type'] ? '/' + route.params['type'] : ''}`;
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return observableOf(null);
      }));
  }
}
