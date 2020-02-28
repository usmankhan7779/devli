
import {of as observableOf} from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { CommonService } from '../../shared/services/common.service';

export interface NameValueObj {
  name: string;
  value: string;
}

@Injectable()
export class TargetsService {
  nflStatsSeasons;
  savedTeamDD;
  savedStatsDD;
  savedTargetsDD;
  get snapsMainRadio() {
    return this._snapsMainRadio.slice(0);
  }

  get snapsSecondaryRadio() {
    return this._snapsSecondaryRadio.slice(0);
  }

  _snapsMainRadio: NameValueObj[] = [
    {
      name: 'Stats',
      value: 'stats'
    },
    {
      name: 'Snaps',
      value: 'snaps'
    },
    {
      name: 'Rush Att',
      value: 'rush'
    },
    {
      name: 'Targets',
      value: 'targets'
    },
    {
      name: 'Receptions',
      value: 'receptions'
    },
    {
      name: 'Touches',
      value: 'touches'
    },
    {
      name: 'RZ Rush Att',
      value: 'redzone-rush'
    },
    {
      name: 'RZ Targets',
      value: 'redzone-targets'
    },
    {
      name: 'RZ Touches',
      value: 'redzone-touches'
    },
    {
      name: 'RZ Receptions',
      value: 'redzone-receptions'
    },
  ];

  _snapsSecondaryRadio = [
    {
      'name': 'Offense',
      'longName': 'Offense',
      'snaps': 'snap-counts',
      'receptions': 'nfl-receptions',
      'targets': 'nfl-targets',
    },
    {
      'name': 'QB',
      'stats': ['player-stats', 'quarterback-qb-stats'],
      'snaps': ['snap-counts', 'quarterback-qb-snap-counts'],
    },
    {
      'name': 'RB',
      'stats': ['player-stats', 'runningback-rb-stats'],
      'snaps': ['snap-counts', 'running-back-rb-snap-counts'],
      'redzone-receptions': 'running-back-rb-redzone-receptions',
      'receptions': ['nfl-receptions', 'running-back-rb-receptions'],
      'targets': ['nfl-targets', 'running-back-rb-targets'],
      'redzone-targets': 'running-back-rb-redzone-targets',
      'touches': ['player-stats', 'running-back-rb-touches'],
      'redzone-touches': 'running-back-rb-redzone-touches',
      'rush': ['player-stats', 'running-back-rb-rush-attempts'],
      'redzone-rush': 'running-back-rb-redzone-rush-attempts'
    },
    {
      'name': 'WR',
      'stats': ['player-stats', 'wide-receiver-wr-stats'],
      'snaps': ['snap-counts', 'wide-receiver-wr-snap-counts'],
      'targets': ['nfl-targets', 'wide-receiver-wr-targets'],
      'redzone-targets': 'wide-receiver-wr-redzone-targets',
      'redzone-receptions': 'wide-receiver-wr-redzone-receptions',
      'receptions': ['nfl-receptions', 'wide-receiver-wr-receptions'],
    },
    {
      'name': 'TE',
      'stats': ['player-stats', 'tight-end-te-stats'],
      'snaps': ['snap-counts', 'tight-end-te-snap-counts'],
      'targets': ['nfl-targets', 'tight-end-te-targets'],
      'redzone-targets': 'tight-end-te-redzone-targets',
      'redzone-receptions': 'tight-end-te-redzone-receptions',
      'receptions': ['nfl-receptions', 'tight-end-te-receptions'],
    },
    {
      'longName': 'O-Line',
      'name': 'OL',
      'snaps': ['snap-counts', 'offensive-line-snap-counts'],
    },
    {
      'longName': 'D',
      'name': 'D',
      'stats': ['player-stats', 'defensive-players-stats'],
      'snaps': ['snap-counts', 'defensive-players-snap-counts']
    }
  ];

  constructor(
    private http: TransferHttp,
    private commonService: CommonService
  ) { }

  saveDD(ddObj, type: 'savedTeamDD' | 'savedStatsDD' | 'savedTargetsDD' = 'savedTeamDD') {
    this[type] = {...ddObj};
  }

  getSavedDD(type: 'savedTeamDD' | 'savedStatsDD' | 'savedTargetsDD' = 'savedTeamDD') {
    if (this[type]) {
      return {...this[type]};
    }
    return null;
  }

  removeSavedDD(type: 'savedTeamDD' | 'savedStatsDD' | 'savedTargetsDD' = 'savedTeamDD') {
    this[type] = null;
  }

  getTableTypes() {
    return [
      'wide-receiver-wr-targets',
      'running-back-rb-rush-attempts',
      'running-back-rb-targets',
      'tight-end-te-targets',
      'wide-receiver-wr-redzone-targets',
      'running-back-rb-redzone-touches'
    ];
  }

  getAllNflTargets(year: string | number) {
    const endpoint = `${environment.api_url}/nfl/fetch/targets/${year}/RB,WR,TE`;
    return this.http.get(endpoint).pipe(
      map(this.handleWeeks));

  }
  getAllNflSnaps(year: string | number) {
    const endpoint = `${environment.api_url}/nfl/fetch/snaps/${year}/QB,RB,WR,TE`;
    return this.http.get(endpoint).pipe(
      map(this.handleWeeks));
  }

  getAllNflReceptions(year: string | number) {
    const endpoint = `${environment.api_url}/nfl/fetch/receptions/${year}/OFF`;
    return this.http.get(endpoint).pipe(
      map(this.handleWeeks));
  }

  getNflTargets(targetType: string, type: string, year: string | number) {
    const endpoint = `${environment.api_url}/nfl/fetch/${type}/${year}/${targetType}`;
    return this.http.get(endpoint).pipe(
      map(this.handleWeeks));
  }

  getAvailableNflStatsSeasons() {
    if (this.nflStatsSeasons) {
      return observableOf(_.cloneDeep(this.nflStatsSeasons));
    }
    const endpoint = `${environment.api_url}/nfl/fetch/seasons/stats/available`;
    return this.http.get(endpoint).pipe(
      map(res => {
        this.commonService.sortYearArr(res);
        this.nflStatsSeasons = res;
        return res;
      }));
  }

  countRushPercentage(data, item) {
    const teamName = item.team;
    const playerTotal = item.total;
    const teamTotal = data.reduce((sum, player) => {
      if (player.team === teamName) {
        return sum + player.total;
      }
      return sum;
    }, 0);
    if (teamTotal) {
      return Number((playerTotal / teamTotal * 100).toFixed(2));
    }
    return 0;
  }

  private handleWeeks(res) {
    if (res && res.data && res.data[0] && res.data[0].weeks && Array.isArray(res.data[0].weeks)) {
      res.data.forEach(item => {
        const weeksObj = {};
        item.name = item.name || item.full_name;
        item.touchdowns = item.touchdowns || item.receiving_touchdowns;
        item.weeks.forEach((weekVal, i) => {
          weeksObj[i + 1] = weekVal;
        });
        item.weeks = weeksObj;
      });
    }
    return res;
  }
}
