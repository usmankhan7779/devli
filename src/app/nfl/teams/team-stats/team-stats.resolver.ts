
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
export class TeamStatsResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private commonService: CommonService,
    private serverResponseService: ServerResponseService,
    private nflService: NflService,
    private teamService: TeamService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (!_.includes(this.teamService.availableTeamStats, route.params['type'])) {
      this.router.navigate(['/404']);
      return observableOf(null);
    }
    const savedDDs = this.teamService.getSavedDD();
    let queryParams: any;
    if (savedDDs && savedDDs.conferenceDropdown && savedDDs.conferenceDropdown.length) {
      queryParams = {
        conference: this.commonService.getActiveCheckBoxItems(savedDDs.conferenceDropdown, 'id')[0],
        division: this.commonService.getActiveCheckBoxItems(savedDDs.divisionDropdown, 'id')[0],
        season_type: this.commonService.getActiveCheckBoxItems(savedDDs.seasonTypeDropdown, 'id')[0],
      };
    }
    const year = this.nflService.getPreSelectedLeagueSeason() || 'current';
    return this.teamService.getTeamStatsData(year, route.params['type'], queryParams).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = `/nfl/team-stats${route.params['type'] ? '/' + route.params['type'] : ''}`;
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return observableOf(null);
      }));
  }
}
