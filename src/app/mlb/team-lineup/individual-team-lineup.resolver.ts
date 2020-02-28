
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';

import { TeamLineupService } from './team-lineup.service';
import { ServerResponseService } from '../../shared/services/server-response.service';

@Injectable()
export class IndividualTeamLineupResolver implements Resolve<any> {
  constructor(
    private teamLineupService: TeamLineupService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (route.params['team_name'] === 'los-angeles-angels-of-anaheim') {
      return this.serverResponseService.redirect('/mlb/lineups/los-angeles-angels');
    }
    if (route.params['team_name'] === 'marco-estrada') {
      return this.serverResponseService.redirect('/mlb/lineups');
    }
    if (route.params['team_name'] === 'washington-national') {
      return this.serverResponseService.redirect('/mlb/lineups/washington-nationals');
    }
    if (route.params['team_name'] === 'minneosta-twins') {
      return this.serverResponseService.redirect('/mlb/lineups/minnesota-twins');
    }
    if (route.params['team_name'] === 'philadelphia-philles') {
      return this.serverResponseService.redirect('/mlb/lineups/philadelphia-phillies');
    }
    if (route.params['team_name'] === 'san-francisc-giants' || route.params['team_name'] === 'san-franciso-giants') {
      return this.serverResponseService.redirect('/mlb/lineups/san-francisco-giants');
    }
    let _year: string | number;
    if (this.teamLineupService.getPreSelectedTeamSeason()) {
      _year = this.teamLineupService.getPreSelectedTeamSeason();
    }
    return this.teamLineupService.mlbTeamLineup(route.params['team_name'], _year).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = `/mlb/lineups/${route.params['team_name']}`;
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
