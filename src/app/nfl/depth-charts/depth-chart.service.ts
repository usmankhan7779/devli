
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { CommonService } from '../../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class DepthChartService {
  private preSelectedTeamSeason: number;
  constructor(
    private http: TransferHttp,
    private commonService: CommonService
  ) { }

  getDepthCharts() {
    const endpoint = `${environment.api_url}/nfl/fetch/depth_charts/gateway`;
    return this.http.get(endpoint).pipe(
      map((data) => {
        if (data && data.depth_charts && data.depth_charts.length) {
          data.depth_charts.forEach(depth_chart => {
            depth_chart.home_wr.sort(this.sortByNumber.bind(this, 'depthposition'));
            depth_chart.away_wr.sort(this.sortByNumber.bind(this, 'depthposition'));
            depth_chart.home_rb.sort(this.sortByNumber.bind(this, 'depthposition'));
            depth_chart.away_rb.sort(this.sortByNumber.bind(this, 'depthposition'));
          });
        }
        return data;
      }));
  }

  private sortByNumber(prop, a, b) {
    let x;
    let y;
    b[prop] ? x = parseInt(b[prop].replace(/\D/g, ''), 10) : x = 0;
    a[prop] ? y = parseInt(a[prop].replace(/\D/g, ''), 10) : y = 0;
    let res = x < y ? -1 : x > y ? 1 : 0;
    res = res * -1;
    return res;
  }

  getDepthChartsRoutes() {
    const endpoint = `${environment.api_url}/nfl/fetch/depth_charts/current`;
    return this.http.get(endpoint).pipe(
      map((data) => {
        return data;
      }));
  }

  getIndividualDepthChart(name: string, year?) {
    let _year;
    if (year && isNaN(parseInt(year, 10))) {
      return observableThrowError('year should be integer');
    } else if (!year) {
      _year = 'current';
    } else {
      _year = year;
    }
    const endpoint = `${environment.api_url}/nfl/fetch/depth_charts/${_year}/${name}`;
    return this.http.get(endpoint).pipe(
      map((res) => {
        this.commonService.sortYearArr(res.seasons_dropdown);
        return res;
      }));
  }

  private extractData(res: any) {
    return res;
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


  createAlternativeStructure(depthCharts, hexes) {
    const res = [];
    depthCharts.forEach((matchup) => {
      res.push(
        this.handleAlternativeDPItem('away', matchup, hexes),
        this.handleAlternativeDPItem('home', matchup, hexes)
      );
    });
    res.sort((a, b) => {
      if (a.team_full < b.team_full) {
        return -1;
      }
      if (a.team_full > b.team_full) {
        return 1;
      }
      return 0;
    });
    return res;
  }

  private handleAlternativeDPItem(teamSide: 'home' | 'away', item, hexes) {
    return {
      team_full: item.game_info[`${teamSide}_team_full`],
      team_name: item.game_info[`${teamSide}_team_name`],
      depth_chart_route: item[`${teamSide}_depth_chart_route`],
      white_logo: item[`${teamSide}_white_logo`],
      matchup_route: item.matchup_route,
      game_key: item.game_key,
      primary_hex: hexes.primary_hex[item.game_info[`${teamSide}_team_full`]],
      secondary_hex: hexes.secondary_hex[item.game_info[`${teamSide}_team_full`]],
      players: {
        qb: item[`${teamSide}_qb`],
        rb: item[`${teamSide}_rb`],
        wr: item[`${teamSide}_wr`],
        te: item[`${teamSide}_te`]
      }
    }
  }
}
