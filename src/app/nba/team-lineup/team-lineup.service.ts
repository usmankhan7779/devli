
import { throwError as observableThrowError, Observable, Subject, forkJoin, of } from 'rxjs';

import { map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';


import { environment } from 'environments/environment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { CommonService } from '../../shared/services/common.service';
import * as _ from 'lodash';
import { NbaService } from '../nba.service';

@Injectable()
export class TeamLineupService {
  private preSelectedTeamSeason: number;
  teamLineupYearWasChanged = new Subject<any>();
  constructor(
    private http: TransferHttp,
    private commonService: CommonService,
    private nbaService: NbaService
  ) { }

  getTeamLineup(teamNameUrl, year?) {
    let _year;
    if (year && isNaN(parseInt(year, 10))) {
      return observableThrowError('year should be integer');
    } else if (!year) {
      _year = 'current';
    } else {
      _year = year;
    }
    const endpoint = `${environment.api_url}/nba/fetch/lineups/${_year}/${teamNameUrl}`;
    const apiCall = this.http.get(endpoint);
    // if (this.nbaService.forceOffseason) {
    //   apiCall = forkJoin([this.nbaService.getSingleWPdepthChart(teamNameUrl).pipe(catchError(err => of(null))), apiCall]);
    // }
    return apiCall.pipe(
      map((response: any) => {
        // if (this.nbaService.forceOffseason) {
        //   const wpTeam = response[0];
        //   if (wpTeam) {
        //     response[1].starters = Object.keys(this.nbaService.posAbbrs).map(pos => {
        //       const starter = wpTeam[pos]['1'];
        //       return this.createPlayerMock(
        //         response[1].starters, starter.name, starter.image, starter.number, starter.depth_chart_position, starter.profile_url
        //       );
        //     });
        //   }
        //   this.commonService.sortYearArr(response[1].seasons_dropdown);
        //   return response[1];
        // }
        this.commonService.sortYearArr(response.seasons_dropdown);
        return response;
      }));
  }

  createPlayerMock(players, name, photo_url, jersey, position, profile_url) {
    const playerFieldsMock = JSON.stringify({
      per_36: {},
      per_100: {},
      per_game: {},
      totals: {},
    });
    const playerData: any = _.find(players, {profile_url: profile_url}) || {};
    return {
      jersey: jersey,
      name: name,
      photo_url: photo_url,
      player_id: playerData.player_id,
      position: position,
      profile_url: profile_url,
      rating: playerData.rating,
      advanced: JSON.parse(playerFieldsMock),
      fantasy: JSON.parse(playerFieldsMock),
      basic: JSON.parse(playerFieldsMock)
    }
  }

  changeTeamLineupYear(data, year?, heading?) {
    this.teamLineupYearWasChanged.next({data, year, heading});
  }

  getPreSelectedTeamSeason() {
    return this.preSelectedTeamSeason;
  }

  setPreSelectedTeamSeason(year: number | string) {
    this.preSelectedTeamSeason = parseInt((<string>year), 10);
  }

  removePreSelectedTeamSeason() {
    this.preSelectedTeamSeason = null;
  }
}
