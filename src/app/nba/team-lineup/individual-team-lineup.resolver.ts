
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TeamLineupService } from './team-lineup.service';
import { ServerResponseService } from '../../shared/services/server-response.service';
import * as _ from 'lodash';

const badRoutesRedirect = {
  'denver': 'denver-nuggets',
  'indiana': 'indiana-pacers',
  'miami': 'miami-heat',
  'new-orleans-': 'new-orleans-pelicans',
  'oklahoma': 'oklahoma-city-thunder'
};

const redirectToNBALineupsList = [
  'dillon-brooks',
  'sanantonio-spurs',
];

const redirectMLBList = [
  'arizona-diamondbacks',
  'atlanta-braves',
  'baltimore-orioles',
  'boston-red-sox',
  'chicago-cubs',
  'chicago-white-sox',
  'cincinnati-reds',
  'cleveland-indians',
  'colorado-rockies',
  'detroit-tigers',
  'houston-astros',
  'kansas-city-royals',
  'los-angeles-angels-of-anaheim',
  'los-angeles-dodgers',
  'miami-marlins',
  'milwaukee-brewers',
  'minnesota-twins',
  'new-york-mets',
  'new-york-yankees',
  'oakland-athletics',
  'philadelphia-phillies',
  'pittsburgh-pirates',
  'st-louis-cardinals',
  'san-diego-padres',
  'san-francisco-giants',
  'seattle-mariners',
  'tampa-bay-rays',
  'texas-rangers',
  'toronto-blue-jays',
  'washington-national'
];

@Injectable()
export class IndividualTeamLineupResolver implements Resolve<any> {
  constructor(
    private teamLineupService: TeamLineupService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const url = `${route.params['team_name']}`;
    if (_.includes(Object.keys(badRoutesRedirect), url)) {
      return this.serverResponseService.redirect(`/nba/lineups/${badRoutesRedirect[url]}`);
    }
    if (_.includes(redirectMLBList, url)) {
      return this.serverResponseService.redirect(`/mlb/lineups/${url}`);
    }
    if (_.includes(redirectToNBALineupsList, url)) {
      return this.serverResponseService.redirect('/nba/lineups');
    }
    let _year: string | number;
    if (this.teamLineupService.getPreSelectedTeamSeason()) {
      _year = this.teamLineupService.getPreSelectedTeamSeason();
    }
    return this.teamLineupService.getTeamLineup(route.params['team_name'], _year).pipe(
      catchError((err) => {
        if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
          console.log('redirectError', err);
          const redirectUrl = `/nba/lineups/${route.params['team_name']}`;
          return this.serverResponseService.redirect(redirectUrl);
        }
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
