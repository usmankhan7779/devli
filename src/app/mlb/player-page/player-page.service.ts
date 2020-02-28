
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import * as _ from 'lodash';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class PlayerPageService {
  readonly ddsObj = {
    activeMain: 'basic',
    activeSecondary: 'all',
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
        name: 'vs. Left',
        prop: 'left',
        selected: false
      },
      {
        name: 'vs. Right',
        prop: 'right',
        selected: false
      },
      {
        name: 'All',
        prop: 'all',
        selected: true
      }
    ]
  };

  constructor(
    private http: TransferHttp
  ) { }

  getDddObj(hittingPitchingDropdown, isPitcher: boolean) {
    const mainGame = _.cloneDeep(this.ddsObj.main);
    mainGame.splice(1, 1);
    const batter = [];
    let activeBatter = '';
    let activeBatterGame = '';
    if (_.includes(hittingPitchingDropdown, 'Hitting')) {
      batter.push({
        name: 'Hitting',
        prop: 'batter',
        selected: !isPitcher
      });
      if (!isPitcher) {
        activeBatter = 'batter';
        activeBatterGame = 'batter';
      }
    }
    if (_.includes(hittingPitchingDropdown, 'Pitching')) {
      batter.push({
        name: 'Pitching',
        prop: 'pitcher',
        selected: isPitcher
      });
      if (isPitcher) {
        activeBatter = 'pitcher';
        activeBatterGame = 'pitcher';
      }
    }
    const res = {
      ..._.cloneDeep(this.ddsObj),
      batter,
      mainGame,
      batterGame: _.cloneDeep(batter),
      activeBatterGame,
      activeBatter,
      activeMainGame: 'basic'
    };
    return res;
  }


  getPlayer(id, season?) {
    let params = new HttpParams();
    if (season) {
      params = params.append('season', season.toString());
    }
    const options = {
      params: params
    };
    const endpoint = `${environment.api_url}/mlb/fetch/players/${id}`;
    return this.http.get(endpoint, options).pipe(
      map((response: any) => {
        return response;
      }));
  }
}
