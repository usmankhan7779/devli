
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';


// Environment
import { environment } from '../../../environments/environment';
import { CollegeFootballService } from '../college-football.service';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  constructor(
    private http: TransferHttp,
    private collegeFootballService: CollegeFootballService
  ) { }

  getRoster(teamName: string, year?) {
    let _year;
    if (year && isNaN(parseInt(year, 10))) {
      return observableThrowError('year should be integer');
    } else if (!year) {
      _year = 'current';
    } else {
      _year = year;
    }
    if (teamName === 'miami-oh-redhawks') {
      teamName = 'miami-(oh)-redhawks';
    }
    const endpoint = `${environment.api_url}/cfb/fetch/roster/${_year}/${teamName}`;
    return this.http.get(endpoint).pipe(
      map(response => {
        response.heading = response.heading || `${response.team_full_name} Roster`;
        response.nav = {
          team_full_name: response.team_full_name,
          team_name: response.team_name,
          team_roster_route: response.team_roster_route,
          team_logo: response.team_logo,
          matchup_season: this.collegeFootballService.getPreSelectedSeason() ||
          this.collegeFootballService.getDefaultSeason(response.seasons_dropdown)
        };
        if (teamName === 'miami-(oh)-redhawks') {
          response.nav.team_roster_route = response.nav.team_roster_route.replace('miami-(oh)-redhawks', 'miami-oh-redhawks');
        }
        if (response.nav.team_roster_route === '/college-football/roster/texas-a&m-aggies') {
          response.team_roster_route = '/college-football/roster/texas-am-aggies';
          response.nav.team_roster_route = '/college-football/roster/texas-am-aggies';
        }
        response.roster = response.data;
        delete response.data;
        return response;
      }));
  }

  getRosterRoutes(year?: string | number) {
    let yearParam = '';
    if (year) {
      yearParam = `/${year}`
    }
    const endpoint = `${environment.api_url}/cfb/fetch/rosters${yearParam}`;
    return this.http.get(endpoint).pipe(
      map((res: any) => {
        if (res.roster_routes && res.roster_routes['Miami (OH) RedHawks']) {
          res.roster_routes['Miami (OH) RedHawks'] = '/college-football/roster/miami-oh-redhawks';
        }
        return res;
      }));
  }
}

