
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import * as _ from 'lodash';

@Injectable()
export class PlayerPageService {
  readonly ddsObj = {
    activeTab: 'all',
    tabs: [
      {
        name: 'All',
        prop: 'all',
        selected: true
      },
      {
        name: 'Player Stats',
        prop: 'player_stats',
        selected: false
      },
      {
        name: 'Game Logs',
        prop: 'game_logs',
        selected: false
      },
      // {
      //   name: 'News',
      //   prop: 'news',
      //   selected: false
      // }
    ],
  };

  constructor(
    private http: TransferHttp
  ) { }

  getDddObj(seasonsDD, player_type, type_dropdown) {
    if (!seasonsDD || !seasonsDD.length) {
      return false;
    }
    const seasons = [];
    let activeSeason = '';
    let activeSeasonGame = '';
    if (seasonsDD) {
      const OrderedSeasons = seasonsDD.sort().reverse();
      OrderedSeasons.forEach((season, i) => {
        seasons.push({
          name: season.toString(),
          selected: i === 0
        });
      });
      activeSeason = seasons[0].name;
      activeSeasonGame = seasons[0].name;
    }
    const main = [];
    type_dropdown.forEach((item) => {
      main.push(      {
        name: item,
        prop: item.toLowerCase(),
        selected: false
      })
    });
    let activeMain = '';
    let activeMainGame = '';
    main.forEach((item) => {
      if (item.prop === player_type.toLowerCase()) {
        item.selected = true;
        activeMain = item.prop;
        activeMainGame = item.prop;
      }
    });
    return {
      ..._.cloneDeep(this.ddsObj),
      mainGame: _.cloneDeep(main),
      main: _.cloneDeep(main),
      activeMain,
      activeMainGame,
      activeTab: _.find(this.ddsObj.tabs, 'selected').prop,
      seasons: _.cloneDeep(seasons),
      seasonsGame: _.cloneDeep(seasons),
      activeSeason,
      activeSeasonGame
    };
  }


  getPlayer(id) {
    const endpoint = `${environment.api_url}/nfl/fetch/players/${id}`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }
}
