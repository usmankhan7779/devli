
import {of as observableOf,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ServerResponseService } from '../../../shared/services/server-response.service';
import { TeamService } from '../team.service';
import { CommonService } from '../../../shared/services/common.service';
import { NflService } from '../../nfl.service';


@Injectable()
export class TeamStatsGatewayResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private teamService: TeamService,
    private commonService: CommonService,
    private nflService: NflService,
    private serverResponseService: ServerResponseService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
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
    return this.teamService.getTeamStatsData(year, null, queryParams).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = '/nfl/team-stats';
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return observableOf(null);
      }));
  }
}

