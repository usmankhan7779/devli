
import {of as observableOf, Subject } from 'rxjs';

import {map} from 'rxjs/operators';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';



import { environment } from '../../environments/environment';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { AngularFireLiteFirestore } from 'angularfire-lite';
import { FirestoreService } from '../shared/services/firestore.service';
import { NbaService } from '../nba/nba.service';
import * as _ from 'lodash';
import { ScoreBarHelperService } from './score-bar-helper.service';

@Injectable()
export class ScoreBarService {
  private mlbScoreItems: any = {};
  private nbaScoreItems: any = {};


  constructor(
    private http: TransferHttp,
    private firestore: AngularFireLiteFirestore,
    private firestoreService: FirestoreService,
    private scoreBarHelperService: ScoreBarHelperService,
    private nbaService: NbaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.scoreBarHelperService.firedMlbUpdate.subscribe(() => {
      this.fireMlbUpdate();
    });
  }

  updateScoreItems(league: string, dataArr: any[]) {
    switch (league.toLowerCase()) {
      case 'mlb': {
        return this.updateMLBScoreItems(dataArr);
      }
      case 'nba': {
        return this.updateNBAScoreItems(dataArr);
      }
    }
  }

  getRealtimeScorebarData(query) {
    if (_.includes(query, 'nba') && this.nbaService.forceOffseason) {
      return observableOf([]);
    }
    return this.firestore.read(query).pipe(
      map((res) => {
        return res;
      }));
  }

  getData(league: string) {
    if (league === 'nba' && this.nbaService.forceOffseason) {
      return observableOf([]);
    }
    const endpoint = `${environment.api_url}/${league}/fetch/scorebar`;
    return this.http.get(endpoint);
  }

  private updateMLBScoreItems(itemsArr: any[]) {
    if (!itemsArr || itemsArr.length === 0) {
      return;
    }
    itemsArr.forEach(item => {
      this.mlbScoreItems[item.game_id] = {
        away_is_batting: item.inning_half.toLowerCase() === 't',
        away_team_runs: item.away_team_runs,
        home_is_batting: item.inning_half.toLowerCase() === 'b',
        home_team_runs: item.home_team_runs,
        inning: item.inning,
        inning_half: item.inning_half,
        outs: item.outs,
        away_team: item.away_team,
        away_win_probability: item.away_win_probability,
        home_team: item.home_team,
        home_win_probability: item.home_win_probability,
        status: item.status,
        game_updated: item.game_updated
      };
    });
    this.fireMlbUpdate();
  }

  fireMlbUpdate() {
    if (this.mlbScoreItems) {
      setTimeout(() => {
        this.scoreBarHelperService.mlbScoreArrUpdated.next(this.mlbScoreItems);
      });
    }
  }

  private updateNBAScoreItems(itemsArr: any[]) {
    if (!itemsArr || itemsArr.length === 0) {
      return;
    }
    itemsArr.forEach(item => {
      this.nbaScoreItems[item.game_id] = {
        away_team_score: item.away_team_score,
        home_team_score: item.home_team_score,
        quarter_integer: item.quarter_integer,
        minutes: item.minutes,
        seconds: item.seconds,
        status: item.status
      };
    });
    this.scoreBarHelperService.nbaScoreArrUpdated.next(this.nbaScoreItems);
  }
}
