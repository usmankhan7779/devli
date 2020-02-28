
import {of as observableOf,  Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TeamStatsService } from './team-stats.service';
import { CommonService } from '../../shared/services/common.service';
import { NbaService } from '../nba.service';
import { ServerResponseService } from '../../shared/services/server-response.service';


@Injectable()
export class TeamStatsGatewayResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private teamService: TeamStatsService,
    private commonService: CommonService,
    private nbaService: NbaService,
    private serverResponseService: ServerResponseService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const savedDDs = this.teamService.getSavedDD();
    let queryParams: any;
    if (savedDDs && savedDDs.conferenceDropdown && savedDDs.conferenceDropdown.length) {
      queryParams = {
        conference: this.commonService.getActiveCheckBoxItems(savedDDs.conferenceDropdown, 'id')[0],
        mode: this.commonService.getActiveCheckBoxItems(savedDDs.modeDropdown, 'id')[0]
      };
    }
    const year = this.nbaService.getPreSelectedLeagueSeason() || 'current';
    return this.teamService.getTeamStatsData(year, null, queryParams).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = '/nba/team-stats';
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return observableOf(null);
      }));
  }
}

