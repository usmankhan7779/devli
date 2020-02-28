
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { TransferHttp } from '../../../../modules/transfer-http/transfer-http';
import * as _ from 'lodash';

@Injectable()
export class SinglePlayerService {

  private readonly playersWithArticles = {
    'bryn forbes': '174',
    'giannis antetokounmpo': '173',
    'john wall': '172',
    'damian lillard': '171',
    'paul george': '170',
    'lou williams': '169',
    'bradley beal': '168',
    'stephen curry': '167',
    'karl anthony towns': '166',
    'kawhi leonard': '165',
    'jusuf nurkic': '164',
    'joel embiid': '163',
    'anthony davis': '162',
    'lamarcus aldridge': '161',
    'luka doncic': '160',
    'kyrie irving': '159',
    'klay thompson': '158',
    'demar derozan': '157',
    'james harden': '156',
    'lebron james': '155',
    'kevin durant': '210',
    'derrick rose': '211'
  };
  private readonly playersWithBettingArticles = {
    'bryn forbes': '158',
    'giannis antetokounmpo': '157',
    'john wall': '156',
    'damian lillard': '155',
    'paul george': '154',
    'lou williams': '153',
    'bradley beal': '152',
    'stephen curry': '151',
    'karl anthony towns': '150',
    'kawhi leonard': '149',
    'jusuf nurkic': '148',
    'joel embiid': '147',
    'anthony davis': '146',
    'lamarcus aldridge': '145',
    'luka doncic': '144',
    'kyrie irving': '143',
    'klay thompson': '142',
    'demar derozan': '141',
    'james harden': '140',
    'lebron james': '139'
  };

  readonly ddsObj = {
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
        name: 'Articles',
        prop: 'articles',
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
    main: [
      {
        name: 'Basic',
        prop: 'basic',
        selected: true
      },
      {
        name: 'Advanced',
        prop: 'advanced',
        selected: false
      },
      {
        name: 'Fantasy',
        prop: 'fantasy',
        selected: false
      }
    ],
    secondary: [
      {
        name: 'Season',
        prop: 'totals',
        selected: true
      },
      {
        name: 'Per Game',
        prop: 'per_game',
        selected: false
      },
      {
        name: 'Per 100 Possessions',
        prop: 'per_100',
        selected: false
      },
      {
        name: 'Per 36 Minutes',
        prop: 'per_36',
        selected: false
      }
    ]
  };

  constructor(
    private http: TransferHttp
  ) { }

  getDddObj(seasonsDD) {
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
    return {
      ..._.cloneDeep(this.ddsObj),
      mainGame: _.cloneDeep(this.ddsObj.main),
      activeMain: _.find(this.ddsObj.main, 'selected').prop,
      activeMainGame: _.find(this.ddsObj.main, 'selected').prop,
      activeSecondary: _.find(this.ddsObj.secondary, 'selected').prop,
      activeTab: _.find(this.ddsObj.tabs, 'selected').prop,
      seasons: _.cloneDeep(seasons),
      activeSeason,
      seasonsGame: _.cloneDeep(seasons),
      activeSeasonGame
    };
  }

  getPlayerArticlesId(name: string) {
    if (!name) {
      return;
    }
    return this.playersWithArticles[name.toLowerCase()];
  }

  getPlayerBettingArticlesId(name: string) {
    if (!name) {
      return;
    }
    return this.playersWithBettingArticles[name.toLowerCase()];
  }

  getPlayer(id) {
    const endpoint = `${environment.api_url}/nba/fetch/players/${id}`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }
}
