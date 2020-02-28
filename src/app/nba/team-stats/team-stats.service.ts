import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { CommonService } from '../../shared/services/common.service';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {throwError as observableThrowError } from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable()
export class TeamStatsService {
  private sortBy;
  private savedDD;
  readonly conferenceOrder = ['NBA', 'East', 'West'];
  readonly availableTeamStats = [
    'offense',
    'defense',
  ];

  rankingsConfig = [3, 7, 10, 13, 16, 20, 23, 27, 30];

  readonly headerMap = {
    teamStats: {
      offense: {
        Points: 'PTS',
        OffensiveRebounds: 'ORB',
        Assists: 'AST',
        Turnovers: 'TO',
        FieldGoalsMade: 'FGM',
        FieldGoalsAttempted: 'FGA',
        ThreePointersAttempted: '3PA',
        ThreePointersMade: '3PM',
        FieldGoalsPercentage: 'FG%',
        ThreePointersPercentage: '3P%',
        TrueShootingPercentage: 'TS%',
        FreeThrowsPercentage: 'FT%',
        OffensiveRating: 'OFF RTG',
        Pace: 'PACE'
      },
      defense: {
        Opponent_Points: 'PTS ALLOW',
        Opponent_Rebounds: 'REB ALLOW',
        Opponent_OffensiveRebounds: 'ORB ALLOW',
        Opponent_Assists: 'AST ALLOW',
        Opponent_Steals: 'STL',
        Opponent_DefensiveRebounds: 'DRB ALLOW',
        Opponent_FieldGoalsMade: 'FG ALLOW',
        Opponent_ThreePointersMade: '3PT ALLOW',
        Opponent_BlockedShots: 'BLK',
        Opponent_Turnovers: 'TOV',
        Opponent_FieldGoalsPercentage: 'OPP FG%',
        Opponent_ThreePointersPercentage: 'OPP 3PT%',
        DefensiveRating: 'DEF RTG'
      }
    },
    teamRankings: {
      offense: {
        Wins: 'WINS',
        Losses: 'LOSSES',
        Points: 'PTS',
        TotalRebounds: 'TRB',
        OffensiveRebounds: 'ORB',
        Assists: 'AST',
        Turnovers: 'TO',
        FieldGoalsMade: 'FGM',
        FieldGoalsAttempted: 'FGA',
        ThreePointersAttempted: '3PTA',
        ThreePointersMade: '3PTM',
        FreeThrowsAttempted: 'FTA',
        FreeThrowsMade: 'FTM',
        FieldGoalsPercentage: 'FG%',
        ThreePointersPercentage: '3PT%',
        TrueShootingPercentage: 'TS%',
        FreeThrowsPercentage: 'FT%',
        OffensiveRating: 'OFF RTG',
        Pace: 'PACE'
      },
      defense: {
        Opponent_Points: 'PTS ALLOW',
        Opponent_Rebounds: 'REB ALLOW',
        Opponent_OffensiveRebounds: 'ORB ALLOW',
        Opponent_Assists: 'AST ALLOW',
        Steals: 'STL',
        DefensiveRebounds: 'DEF REB',
        Opponent_FieldGoalsMade: 'FG ALLOW',
        Opponent_ThreePointersMade: '3PT ALLOW',
        Opponent_BlockedShots: 'BLK',
        Opponent_Turnovers: 'TOV',
        Opponent_FieldGoalsPercentage: 'OPP FG%',
        Opponent_ThreePointersPercentage: 'OPP 3PT%',
        DefensiveRating: 'DEF RTG'
      }
    }
  };

  readonly columnHeaders = {
    teamStats: {
      offense: [
        'team',
        'Points',
        'OffensiveRebounds',
        'Assists',
        'Turnovers',
        'FieldGoalsMade',
        'FieldGoalsAttempted',
        'ThreePointersAttempted',
        'ThreePointersMade',
        'FieldGoalsPercentage',
        'ThreePointersPercentage',
        'TrueShootingPercentage',
        'FreeThrowsPercentage',
        'OffensiveRating',
        'Pace'
      ],
      defense: [
        'team',
        'Opponent_Points',
        'Opponent_Rebounds',
        'Opponent_OffensiveRebounds',
        'Opponent_Assists',
        'Opponent_Steals',
        'Opponent_DefensiveRebounds',
        'Opponent_FieldGoalsMade',
        'Opponent_ThreePointersMade',
        'Opponent_BlockedShots',
        'Opponent_Turnovers',
        'Opponent_FieldGoalsPercentage',
        'Opponent_ThreePointersPercentage',
        'DefensiveRating',
      ]
    },
    teamRankings: {
      offense: [
        'team',
        'Wins',
        'Losses',
        'Points',
        'TotalRebounds',
        'OffensiveRebounds',
        'Assists',
        'Turnovers',
        'FieldGoalsMade',
        'FieldGoalsAttempted',
        'ThreePointersAttempted',
        'ThreePointersMade',
        'FreeThrowsAttempted',
        'FreeThrowsMade',
        'FieldGoalsPercentage',
        'ThreePointersPercentage',
        'TrueShootingPercentage',
        'FreeThrowsPercentage',
        'OffensiveRating',
        'Pace'
      ],
      defense: [
        'team',
        'Opponent_Points',
        'Opponent_Rebounds',
        'Opponent_OffensiveRebounds',
        'Opponent_Assists',
        'Steals',
        'DefensiveRebounds',
        'Opponent_FieldGoalsMade',
        'Opponent_ThreePointersMade',
        'Opponent_BlockedShots',
        'Opponent_Turnovers',
        'Opponent_FieldGoalsPercentage',
        'Opponent_ThreePointersPercentage',
        'DefensiveRating'
      ]
    }
  };

  constructor(
    private http: TransferHttp,
    private commonService: CommonService
  ) { }

  saveDD(ddObj) {
    return this.savedDD = {...ddObj};
  }

  getSavedDD() {
    if (this.savedDD) {
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

  getTeamStatsData(year = 'current', statsType?, queryParams?: {conference: string, mode?: string}, pageType?: string) {
    const _year = this.handleCurrentYear(year);
    let params = new HttpParams();
    if (queryParams) {
      if (queryParams.conference) {
        params = params.append('division', queryParams.conference);
      }
      if (queryParams.mode) {
        params = params.append('mode', queryParams.mode);
      }
    }
    const options = {
      params: params
    };
    // tslint:disable-next-line:max-line-length
    let endpoint = '';
    if (pageType === 'rankings') {
      endpoint = `${environment.api_url}/nba/fetch/teams/team-rankings${statsType === 'defense' ? '/' + statsType : ''}/${_year}`;
    } else {
      endpoint = `${environment.api_url}/nba/fetch/teams/stats${statsType ? '/' + statsType : ''}/${_year}`;
    }
    return this.http.get(endpoint, options).pipe(
      map((res: any) => {
        this.commonService.sortYearArr(res.seasons_dropdown);
        return res;
      }));
  }

  generateStatsTypeDD(selectedStatsType?, pageType?) {
    const statTypeObj = {
      'Leaders': null,
      'Offense': this.availableTeamStats[0],
      'Defense': this.availableTeamStats[1],
    };
    if (pageType === 'rankings') {
      delete statTypeObj['Leaders'];
    }
    const statsType = this.commonService.prepareDDItems(statTypeObj, false, false);
    (<any>_.find(statsType, {id: selectedStatsType || null})).selected = true;
    const activeStatsType = (<any>_.find(statsType, 'selected')).id;
    return {statsType, activeStatsType};
  }

  generateTeamStatsDdObject(selectedStatsType?, pageType?) {
    const conferenceDropdown = this.commonService.prepareDDItems({'NBA': null, 'East': 'east', 'West': 'west'}, false, false);
    const modeDropdown = this.commonService.prepareDDItems({'Per Game': 'per_game', 'Total': 'total'}, false, false);

    const statsType = this.generateStatsTypeDD(selectedStatsType, pageType);

    (<any>_.find(conferenceDropdown, {name: 'NBA'})).selected = true;
    (<any>_.find(modeDropdown, {name: 'Total'})).selected = true;

    const activeConference = (<any>_.find(conferenceDropdown, 'selected')).id;
    const activeMode = (<any>_.find(modeDropdown, 'selected')).id;
    const res: any = {
      conferenceDropdown: this.orderConferenceObject(conferenceDropdown),
      statsType: statsType.statsType,

      activeConference,
      activeStatsType: statsType.activeStatsType
    };
    if (pageType !== 'rankings') {
      res.modeDropdown = modeDropdown;
      res.activeMode = activeMode;
    }
    return res;
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
