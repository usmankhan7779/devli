
import {throwError as observableThrowError, forkJoin, of } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import * as _ from 'lodash';
import { CommonService } from '../../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class DepthChartService {
  private preSelectedTeamSeason;

  readonly posKeys = {
    'point_guards': 'PG',
    'shooting_guards': 'SG',
    'small_forwards': 'SF',
    'power_forwards': 'PF',
    'centers': 'C',
  };
  readonly posKeysArr = Object.keys(this.posKeys).map(key => key);

  constructor(
    private http: TransferHttp,
    // private nbaService: NbaService,
    private commonService: CommonService
  ) { }

  getDepthCharts(year?) {
    const _year = this.handleYear(year);
    const endpoint = `${environment.api_url}/nba/fetch/depth-charts/gateway/${_year}`;
    const apiCall = this.http.get(endpoint);
    // if (this.nbaService.forceOffseason) {
    //   apiCall = forkJoin([this.nbaService.getWPdepthCharts().pipe(catchError(err => of(null))), apiCall])
    // }
    return apiCall.pipe(
      map((response) => {
        // WP api
        // if (this.nbaService.forceOffseason) {
        //   if (response[0]) {
        //     response[1].data = response[1].data.map(data => {
        //       const wpData = <any>_.find(response[0], {team_name: data.team_fk.full_name});
        //       if (wpData) {
        //         data.point_guards = wpData.point_guards;
        //         data.shooting_guards = wpData.shooting_guards;
        //         data.small_forwards = wpData.small_forwards;
        //         data.power_forwards = wpData.power_forwards;
        //         data.centers = wpData.centers;
        //       }
        //       return data;
        //     });
        //   }
        //   this.commonService.sortYearArr(response[1].seasons_dropdown);
        //   return response[1];
        // }
        this.commonService.sortYearArr(response.seasons_dropdown);
        return response;
      }));
  }

  getDepthChartsNewFormat() {
    const endpoint = `${environment.api_url}/nba/fetch/lineups/all_teams`;
    return this.http.get(endpoint);
  }

  getIndividualDepthChart(name: string, year?) {
    const _year = this.handleYear(year);
    const endpoint = `${environment.api_url}/nba/fetch/depth-charts/${_year}/${name}`;
    const apiCall = this.http.get(endpoint);
    // if (this.nbaService.forceOffseason) {
    //   apiCall = forkJoin([this.nbaService.getSingleWPdepthChart(name).pipe(catchError(err => of(null))), apiCall])
    // }
    return apiCall.pipe(
      map((res) => {
        // if (this.nbaService.forceOffseason) {
        //
        //   res[1] = this.updateDepthChartWithWpPlayers(res[1], res[0]);
        //
        //   res[1].nav = res[1].team_fk.nav;
        //   res[1].heading = res[1].team_fk.heading;
        //   delete res[1].team_fk.nav;
        //   return res[1];
        // }
        res.nav = res.team_fk.nav;
        res.heading = res.team_fk.heading;
        delete res.team_fk.nav;
        return res;
      }));
  }
  /*
  private updateDepthChartWithWpPlayers(res, wpTeam) {
    const allTeamPlayers = Object.keys(this.nbaService.posAbbrs).reduce((all, key) => {
      all.push(...res[key]);
      return all;
    }, []);
    if (wpTeam) {
      Object.keys(this.nbaService.posAbbrs).forEach(pos => {
        res[pos] = Object.keys(wpTeam[pos]).reduce((filtered, order) => {
          const player = wpTeam[pos][order];
          if (player && player.name) {
            const playerData: any = _.find(allTeamPlayers, {profile_url: player.profile_url}) || {};
            filtered.push({
              age: playerData.age,
              experience: playerData.experience,
              lineups_rating: playerData.lineups_rating,
              depth_chart_order: player.depth_chart_order,
              depth_chart_position: player.depth_chart_position,
              jersey: player.number || playerData.jersey,
              name: player.name,
              photo_url: player.image || playerData.photo_url,
              position: player.position,
              profile_url: player.profile_url,
              player_id: player.profile_url,
              short_name: player.short_name,
              team: res.team_fk.key,
              last_7_games: []
            });
          }
          return filtered;
        }, []);
      })
    }
    return res;
  }
  */


  getPreSelectedTeamSeason() {
    return this.preSelectedTeamSeason;
  }

  setPreSelectedTeamSeason(year: string) {
    this.preSelectedTeamSeason = year;
  }

  removePreSelectedTeamSeason() {
    this.preSelectedTeamSeason = '';
  }

  handleDepthChartFormatting(data) {
    const res = data.map(depthChart => {
      this.posKeysArr.forEach(key => {
        depthChart[key] = _.groupBy(depthChart[key], 'depth_chart_order');
        for (const numKey in depthChart[key]) {
          if (depthChart[key].hasOwnProperty(numKey) && Array.isArray(depthChart[key][numKey]) && depthChart[key][numKey][0]) {
            depthChart[key][numKey] = depthChart[key][numKey][0];
          }
        }
      });
      return depthChart;
    });
    res.sort((a, b) => {
      if (a.team_fk.nav.team_name_full < b.team_fk.nav.team_name_full) {
        return -1;
      }
      if (a.team_fk.nav.team_name_full > b.team_fk.nav.team_name_full) {
        return 1;
      }
      return 0;
    });
    return res;
  }

  private extractData(res: any) {
    return res;
  }

  private handleYear(year?) {
    let _year;
    if (year && isNaN(parseInt(year, 10))) {
      return observableThrowError('year should be integer');
    } else if (!year) {
      _year = 'current';
    } else {
      _year = year;
    }
    return _year;
  }
}
