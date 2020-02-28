import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';

@Injectable()
export class InGamePredictorService {

  constructor(
    private http: TransferHttp
  ) { }

  getGames() {
    const endpoint = `${environment.api_url}/nfl/fetch/games/upcoming`;
    return this.http.get(endpoint);
  }

  getGameData(gameKey, model) {

    // gameKey = '201710924';
    // model = 'nb';

    const gameChannel = `nfl/fetch/livegame/${gameKey}/${model}`;
    const endpoint = `${environment.api_url}/${gameChannel}`;
    return this.http.get(endpoint);
  }

  prepareBettingCards(bets) {
    const res = [];
    for (let i = 0; i < bets.length; i++) {
      bets[i].predicted_bets = _.groupBy(bets[i].predicted_bets, 'bookmaker_name');
      const predicted_bets = bets[i].predicted_bets;
      const predictedBetsSorted = [];
      for (const key in predicted_bets) {
        if (predicted_bets.hasOwnProperty(key)) {
          predictedBetsSorted.push({
            book: key,
            home: predicted_bets[key][0].away ? predicted_bets[key][1] : predicted_bets[key][0],
            away: predicted_bets[key][0].away ? predicted_bets[key][0] : predicted_bets[key][1]
          });
        }
      }
      bets[i].predicted_bets = predictedBetsSorted.sort((a, b) => {
        if (a.book === 'Lineups.com') {
          return 1;
        }
        if (b.book === 'Lineups.com') {
          return -1;
        }
        if (a.book === b.book) {
          return 0
        }
        return -1;
      });
      res.push(bets[i]);
    }
    return res;
  }

}
