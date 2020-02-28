
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TeamService } from '../team.service';
import { ServerResponseService } from '../../../shared/services/server-response.service';
import { IndTeamStatsService } from './ind-team-stats.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';


@Injectable()
export class IndTeamStatsResolver implements Resolve<any> {
  constructor(
    private serverResponseService: ServerResponseService,
    private teamService: TeamService,
    private indTeamStatsService: IndTeamStatsService,
    private spinnerService: SpinnerService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const teamName = route.params['team_name'];
    if (teamName === 'oakland-') {
      const redirectUrl = '/nfl/team-stats/oakland-raiders';
      return this.serverResponseService.redirect(redirectUrl);
    }
    const year = this.indTeamStatsService.getPreSelectedTeamSeason();
    this.indTeamStatsService.removePreSelectedTeamSeason();
    return this.spinnerService.handleAPICall(this.teamService.getIndTeamStatsData(teamName, year)).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = `/nfl/team-stats/${route.params['team_name']}`;
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
