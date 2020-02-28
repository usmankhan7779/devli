
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';

import * as _ from 'lodash';
import { CommonService } from '../../shared/services/common.service';

@Injectable()
export class StatsService {
  private sortBy = '';
  constructor(
    private http: TransferHttp,
    private commonService: CommonService
  ) { }

  setSortBy(value) {
    this.sortBy = value;
  }

  getSortBy(type) {
    if (this.sortBy) {
      return this.sortBy;
    }
    return this.getDefaultSorting(type);
  }

  getDefaultSorting(type) {
    switch (type) {
      case 'quarterback-qb-stats': {
        return 'passing_yards';
      }
      case 'runningback-rb-stats': {
        return 'rushing_yards';
      }
      case 'wide-receiver-wr-stats': {
        return 'receiving_yards';
      }
      case 'tight-end-te-stats': {
        return 'receiving_yards'
      }
      case 'defensive-players-stats': {
        return 'tackles';
      }
      case 'kicker-stats': {
        return 'field_goals_made';
      }
    }
  }

  removeSortBy() {
    this.sortBy = '';
  }

  getPageHeading(type) {
    const pageHeadings = {
      'quarterback-qb-stats': 'Quarterback (QB) Stats',
      'runningback-rb-stats': 'Running Back (RB) Stats',
      'wide-receiver-wr-stats': 'Wide Receiver (WR) Stats',
      'tight-end-te-stats': 'Tight End (TE) Stats',
      'defensive-players-stats': 'Defensive Player Stats',
      'kicker-stats': 'Kicker Stats'
    };
    return pageHeadings[type]
  }

  getAvailableStatsTypes() {
    return {
      'quarterback-qb-stats': 'QB',
      'runningback-rb-stats': 'RB',
      'wide-receiver-wr-stats': 'WR',
      'tight-end-te-stats': 'TE',
      'defensive-players-stats': 'D',
      'kicker-stats': 'K'
    };
  }

  getDddObj(player_type, type, type_dropdown) {
    const main = [];
    const tabs = [
      {
        name: 'Leaders',
        selected: type === 'player-stats',
        prop: 'player-stats',
        url: ''
      }
    ];
    const availableStatsTypes = this.getAvailableStatsTypes();
    for (const key in availableStatsTypes) {
      if (availableStatsTypes.hasOwnProperty(key)) {
        tabs.push({
          name: availableStatsTypes[key],
          prop: key,
          selected: type === key,
          url: key
        });
      }
    }
    const activeTab = type;
    type_dropdown.forEach((item) => {
      main.push({
        name: item,
        prop: item.toLowerCase(),
        selected: player_type.toLowerCase() === item.toLowerCase()
      })
    });
    const secondary = [
      {
        name: 'Last 3',
        prop: '3',
        selected: false
      },
      {
        name: 'Last 5',
        prop: '5',
        selected: false
      },
      {
        name: 'Season',
        prop: 'season',
        selected: true
      }
    ];
    const items_per_page = this.commonService.prepareDDItems([50, 100, 200, 500], true, false);
    items_per_page[0].selected = true;
    const itemsPerPage = items_per_page[0].name;
    const activeMain = _.find(main, 'selected');
    const activeSecondary = _.find(secondary, 'selected');
    return {
      tabs,
      activeTab,
      main,
      activeMain: activeMain ? activeMain.prop : '',
      secondary,
      activeSecondary: activeSecondary ? activeSecondary.prop : '',
      items_per_page,
      itemsPerPage
    };
  }

  getStats(year, type) {
    const endpoint = `${environment.api_url}/nfl/fetch/player-stats/${year}/${this.getAvailableStatsTypes()[type]}`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        this.commonService.sortYearArr(response.seasons_dropdown);
        return response;
      }));
  }

  getLeaders(year?) {
    const endpoint = `${environment.api_url}/nfl/fetch/player-stats/leaders${year ? '/' + year : ''}`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        this.commonService.sortYearArr(response.seasons_dropdown);
        return response;
      }));
  }

}
