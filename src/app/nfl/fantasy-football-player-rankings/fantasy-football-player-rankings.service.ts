
import {map} from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';

import { HttpParams } from '@angular/common/http';
import * as _ from 'lodash';

// used in nfl module for routing
export const fantasyFootballPlayerRankingsTypes = [
  'quarterback-qb',
  'running-back-rb',
  'tight-end-te',
  'wide-receiver-wr',
  'kicker-k',
  'team-defense-dst',
  'defensive-player-idp',
];

@Injectable()
export class FantasyFootballPlayerRankingsService {
  readonly positionsKeys = {
    'football-rankings': '',
    'quarterback-qb': 'QB',
    'running-back-rb': 'RB',
    'tight-end-te': 'TE',
    'wide-receiver-wr': 'WR',
    'kicker-k': 'K',
    'team-defense-dst': 'DST',
    'defensive-player-idp': 'IDP',
  };
  constructor(
    private http: TransferHttp
  ) {
  }

  getDDdata(url) {
    let itemsPerPageArr = [
      {name: 25, prop: 25, selected: false},
      {name: 50, prop: 50, selected: false},
      {name: 100, prop: 100, selected: false},
      {name: 200, prop: 200, selected: false},
      {name: 'All', prop: 999999, selected: false},
    ];
    let items_per_page = [];
    let activeItemPerPage;
    switch (url) {
      case 'team-defense-dst': {
        itemsPerPageArr = null;
        activeItemPerPage = null;
        break;
      }
      case 'defensive-player-idp':
      case 'football-rankings': {
        itemsPerPageArr.shift();
        break;
      }
      default: {
        break;
      }
    }
    if (itemsPerPageArr) {
      activeItemPerPage = itemsPerPageArr[0];
      activeItemPerPage.selected = true;
      items_per_page = itemsPerPageArr;
    }
    const ddData: any = {
      seasonTabs: [
        { name: 'Standard', prop: '', selected: true },
        { name: 'PPR', prop: '_ppr', selected: false },
        { name: 'Half PPR', prop: '_half_ppr', selected: false },
      ],
      activeSeasonTab: '',
      positionTabs: Object.keys(this.positionsKeys).map(objectKey => {
        return {
          name: this.positionsKeys[objectKey] || 'All',
          selected: false,
          url: this.generateUrl(objectKey),
        }
      }),
      items_per_page,
      activeItemPerPage
    };
    const activeItem = (<any>_.find(ddData.positionTabs, {name: this.getPositionKey(url)})) || ddData.positionTabs[0];
    activeItem.selected = true;
    ddData.acivePositionTab = activeItem.name;
    return ddData;
  }

  getPositionKey(url) {
    return this.positionsKeys[url];
  }

  getFantasyData(year, position, page = 1, itemsPerPage?) {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    if (position) {
      params = params.append('position', position === 'IDP' ? 'DEF' : position); // renamed DEF to IDP
    }
    if (itemsPerPage) {
      params = params.append('page_size', itemsPerPage.toString());
    }
    const options = {
      params: params
    };
    const endpoint = `${environment.api_url}/nfl/fetch/fantasy/football-rankings`;
    // const endpoint = `${environment.api_url}/nfl/fetch/fantasy/football-rankings/2017`;
    return this.http.get(endpoint, options).pipe(
      map((res: any) => {
        // res.is_off_season = false;
        return res;
      }));
  }

  private generateUrl(url) {
    return '/fantasy-football-rankings' + (url && url !== 'football-rankings' ? '/' + url : '');
  }
}
