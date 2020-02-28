
import {of as observableOf,  Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import * as _ from 'lodash';
import { CommonService } from '../../../shared/services/common.service';
import { ServerResponseService } from '../../../shared/services/server-response.service';
import { NbaService } from '../../nba.service';
import { TeamStatsService } from '../team-stats.service';

@Injectable()
export class TeamStatsOffenseDefenseResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private commonService: CommonService,
    private serverResponseService: ServerResponseService,
    private nbaService: NbaService,
    private teamStatsService: TeamStatsService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const type = route.data['type'];
    const pageType = route.data['pageType'];
    if (!_.includes(this.teamStatsService.availableTeamStats, type)) {
      this.router.navigate(['/404']);
      return observableOf(null);
    }
    const savedDDs = this.teamStatsService.getSavedDD();
    let queryParams: any;
    if (savedDDs && savedDDs.conferenceDropdown && savedDDs.conferenceDropdown.length) {
      queryParams = {
        conference: this.commonService.getActiveCheckBoxItems(savedDDs.conferenceDropdown, 'id')[0],
      };
      if (savedDDs.seasonTypeDropdown) {
        queryParams.season_type = this.commonService.getActiveCheckBoxItems(savedDDs.seasonTypeDropdown, 'id')[0];
      }
      if (pageType !== 'rankings') {
        queryParams.mode = this.commonService.getActiveCheckBoxItems(savedDDs.modeDropdown, 'id')[0];
      }
    }
    const year = this.nbaService.getPreSelectedLeagueSeason() || 'current';
    return this.teamStatsService.getTeamStatsData(year, type, queryParams, pageType).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = `/nba/${(pageType === 'rankings' ? 'team-rankings' : 'team-stats')}${type ? '/' + type : ''}`;
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return observableOf(null);
      }));
  }
}
