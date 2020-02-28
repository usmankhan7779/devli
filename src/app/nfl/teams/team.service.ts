
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { CommonService } from '../../shared/services/common.service';
import * as _ from 'lodash';
import { NflService } from '../nfl.service';

@Injectable()
export class TeamService {
  private sortBy;
  private savedDD;
  private savedRankingsDD;
  readonly conferenceOrder = ['NFL', 'AFC', 'NFC'];
  readonly availableTeamRankings = [
    'defense',
    'special-teams'
  ];
  readonly availableTeamStats = [
    'offense',
    'defense',
    'special-teams'
  ];

  constructor(
    private http: TransferHttp,
    private commonService: CommonService,
    private nflService: NflService
  ) { }

  saveDD(ddObj, isRankingDDs = false) {
    if (isRankingDDs) {
      return this.savedRankingsDD = {...ddObj};
    }
    return this.savedDD = {...ddObj};
  }

  getSavedDD(isRankingDDs = false) {
    if (isRankingDDs && this.savedRankingsDD) {
      return this.savedRankingsDD;
    }
    if (!isRankingDDs && this.savedDD) {
      return {...this.savedDD};
    }
    return null;
  }

  setSortBy(value) {
    this.sortBy = value;
  }

  getSortBy() {
    return this.sortBy;
  }

  removeSortBy() {
    this.sortBy = '';
  }

  getTeamStatsData(year = 'current', _statsType?, queryParams?: {conference: string, division: string, season_type: number}) {
    const _year = this.handleCurrentYear(year);
    let params = new HttpParams();
    if (queryParams) {
      if (queryParams.conference) {
        params = params.append('conference', queryParams.conference);
      }
      if (queryParams.division) {
        params = params.append('division', queryParams.division);
      }
      if (queryParams.season_type) {
        params = params.append('season_type', queryParams.season_type.toString());
      }
    }
    const options = {
      params: params
    };
    let statsType;
    if (this.availableTeamStats.indexOf(_statsType) !== -1) {
      statsType = _statsType + '-stats';
    }
    const endpoint = `${environment.api_url}/nfl/fetch/teams/stats${statsType ? '/' + statsType : ''}/${_year}`;
    return this.http.get(endpoint, options).pipe(
      map((res: any) => {
        this.commonService.sortYearArr(res.seasons_dropdown);
        if (!statsType) {
          try {
            res = this.addTeamStatsLinkToLeaderTeams(res);
          } catch (e) {
            console.error(e);
          }
        } else {
          res = this.addTeamStatsLinkToTeams(res);
        }

        return res;
      }));
  }

  private addTeamStatsLinkToTeams(res) {
    res.data = res.data.map(team => {
      team.team_stats_route = team.team_depth_chart_route.replace('/nfl/depth-charts', '/nfl/team-stats');
      return team;
    });
    return res;
  }

  private addTeamStatsLinkToLeaderTeams(res) {
    const resKeys = Object.keys(res);
    for (let i = 0; i < resKeys.length; i++) {
      if (res[resKeys[i]] && res[resKeys[i]].leaders && res[resKeys[i]].leaders.length) {
        res[resKeys[i]].leaders = res[resKeys[i]].leaders.map((leader => {
          if (leader && leader.team) {
            const teamInfo = this.nflService.getNflTeamInfo(leader.team);
            if (teamInfo) {
              const teamStatsRoute = teamInfo.team_route;
              if (teamStatsRoute) {
                leader.team_stats_route = `/nfl/team-stats/${teamStatsRoute}`;
              }
            }
          }
          return leader;
        }));
      }
    }
    return res;
  }

  getTeamRankingsData(year = 'current', statsType?, queryParams?: {conference: string, division: string}) {
    const _year = this.handleCurrentYear(year);
    let params = new HttpParams();
    if (queryParams) {
      if (queryParams.conference) {
        params = params.append('conference', queryParams.conference);
      }
      if (queryParams.division) {
        params = params.append('division', queryParams.division);
      }
    }
    const options = {
      params: params
    };
    const endpoint = `${environment.api_url}/nfl/fetch/teams/team-rankings${statsType ? '/' + statsType : ''}/${_year}`;
    return this.http.get(endpoint, options).pipe(
      map((res: any) => {
        this.commonService.sortYearArr(res.seasons_dropdown);
        return res;
      }));
  }

  getTeamList() {
    const endpoint = `${environment.api_url}/nfl/fetch/teams`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getIndTeamStatsData(teamName, year?) {
    const _year = this.handleCurrentYear(year);
    const endpoint = `${environment.api_url}/nfl/fetch/teams/stats/${teamName}/${_year}`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getNbaTeamStatsData(teamName, year?) {
    const _year = this.handleCurrentYear(year);
    const endpoint = `${environment.api_url}/nba/fetch/teams/stats/${teamName}/${_year}`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }
  generateStatsTypeDD(selectedStatsType?) {
    const statsType = this.commonService.prepareDDItems({
      'Leaders': null,
      'Offense': this.availableTeamStats[0],
      'Defense': this.availableTeamStats[1],
      'Special Teams': this.availableTeamStats[2],
    }, false, false);
    (<any>_.find(statsType, {id: selectedStatsType || null})).selected = true;
    const activeStatsType = (<any>_.find(statsType, 'selected')).id;
    return {statsType, activeStatsType};
  }

  generateRankingsTypeDD(selectedStatsType?) {
    const rankingsType = this.commonService.prepareDDItems({
      'Offense': null,
      'Defense': this.availableTeamRankings[0],
      'Special Teams': this.availableTeamRankings[1],
    }, false, false);
    (<any>_.find(rankingsType, {id: selectedStatsType || null})).selected = true;
    const activeRankingsType = (<any>_.find(rankingsType, 'selected')).id;
    return {rankingsType, activeRankingsType};
  }

  generateTeamRankingsDdObject(divisionDropdownArg, conferenceDropdownArg, selectedRankingsType?) {
    const conferenceDropdown = this.commonService.prepareDDItems(conferenceDropdownArg, false, false);
    const divisionDropdown = this.commonService.prepareDDItems(this.commonService.orderObjectKeys(divisionDropdownArg), false, false);

    const rankingsType = this.generateRankingsTypeDD(selectedRankingsType);

    (<any>_.find(conferenceDropdown, {name: 'NFL'})).selected = true;
    (<any>_.find(divisionDropdown, {name: 'All'})).selected = true;

    const activeConference = (<any>_.find(conferenceDropdown, 'selected')).id;
    const activeDivision = (<any>_.find(divisionDropdown, 'selected')).id;
    return {
      conferenceDropdown: this.orderConferenceObject(conferenceDropdown),
      divisionDropdown,
      rankingsType: rankingsType.rankingsType,

      activeConference,
      activeDivision,
      activeRankingsType: rankingsType.activeRankingsType,
      colorTabs: [ 'On', 'Off'].map(color => {return {'name': color, 'selected': color === 'On'}}),
      activeColorTab: 'On'
    };
  }

  generateTeamStatsDdObject(seasonTypeDropdownArg, divisionDropdownArg, conferenceDropdownArg, selectedStatsType?) {
    const seasonTypeDropdown = this.commonService.prepareDDItems(seasonTypeDropdownArg, false, false);
    const conferenceDropdown = this.commonService.prepareDDItems(conferenceDropdownArg, false, false);
    const divisionDropdown = this.commonService.prepareDDItems(divisionDropdownArg, false, false);

    const statsType = this.generateStatsTypeDD(selectedStatsType);

    (<any>_.find(seasonTypeDropdown, {name: 'Regular'})).selected = true;
    (<any>_.find(conferenceDropdown, {name: 'NFL'})).selected = true;
    (<any>_.find(divisionDropdown, {name: 'All'})).selected = true;

    const activeSeasonType = (<any>_.find(seasonTypeDropdown, 'selected')).id;
    const activeConference = (<any>_.find(conferenceDropdown, 'selected')).id;
    const activeDivision = (<any>_.find(divisionDropdown, 'selected')).id;
    return {
      seasonTypeDropdown,
      conferenceDropdown: this.orderConferenceObject(conferenceDropdown),
      divisionDropdown,
      statsType: statsType.statsType,

      activeConference,
      activeSeasonType,
      activeDivision,
      activeStatsType: statsType.activeStatsType
    };
  }

  private orderConferenceObject(arr) {
    return _.sortBy(arr, obj => _.indexOf(this.conferenceOrder, (<any>obj).name));
  }

  private handleCurrentYear(year) {
    if (year === 'current') {
      return year;
    }
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
