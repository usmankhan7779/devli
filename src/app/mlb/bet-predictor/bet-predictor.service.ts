
import {throwError as observableThrowError,  Subject ,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';

import * as _ from 'lodash'
import { environment } from 'environments/environment';
import { CommonService } from '../../shared/services/common.service';
import { InputPanelService } from '../../shared/modals/input-panel-modal/input-panel.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';

interface Prop {
  name: string,
  value: string,
  hideRange?: boolean,
  inputType?: string,
  ddOptions?: any,
  fixedCondition?: boolean,
  canBeFloatOnEqual?: boolean,
  min?: number,
  max?: number
}

@Injectable({
  providedIn: 'root'
})
export class BetPredictorService {
  private preSelectedGameId: number;
  predictedBetCardWasSaved = new Subject();
  predictedBetTabWasDeleted = new Subject();
  savedBetTabWasDeleted = new Subject();

  pitcherProps: Prop[] = [
    {
      name: 'Rating',
      value: 'rating',
      fixedCondition: true,
      canBeFloatOnEqual: true
    },
    {
      name: 'ERA',
      value: 'era'
    },
    {
      name: 'Strikeouts',
      value: 'strikeouts'
    },
    {
      name: 'Decision',
      value: 'decision',
      hideRange: true,
      inputType: 'dd',
      ddOptions: [
        'W', 'L', 'ND'
      ],
      fixedCondition: true
    },
    {
      name: 'Runs Allowed',
      value: 'runs_allowed'
    },
    {
      name: 'Hits Allowed',
      value: 'hits_allowed'
    },
    {
      name: 'IP',
      value: 'ip'
    },
    {
      name: 'BB',
      value: 'walks'
    }
  ];

  matchupProps: Prop[] = [
    {
      name: 'Rain',
      value: 'rain',
      hideRange: true,
      inputType: 'dd',
      ddOptions: [],
      fixedCondition: true
    },
    {
      name: 'Weather',
      value: 'weather',
      hideRange: true,
      inputType: 'dd',
      ddOptions: [],
      fixedCondition: true
    },
    {
      name: 'Wind Direction',
      value: 'wind_direction',
      hideRange: true,
      inputType: 'dd',
      ddOptions: [],
      fixedCondition: true
    },
    {
      name: 'Wind Speed',
      value: 'wind_speed',
      hideRange: true,
      inputType: 'dd',
      ddOptions: [],
      fixedCondition: true
    },
  ];

  batterProps: Prop[] = [
    {
      name: 'Rating',
      value: 'rating',
      fixedCondition: true,
      canBeFloatOnEqual: true
    },
    {
      name: 'Order',
      value: 'order',
      hideRange: true,
      canBeFloatOnEqual: false,
      fixedCondition: true,
      inputType: 'number',
      min: 1,
      max: 9
    },
    {
      name: 'PA',
      value: 'pa'
    },
    {
      name: 'H',
      value: 'hits'
    },
    {
      name: '1B',
      value: 'singles'
    },
    {
      name: '2B',
      value: 'doubles'
    },
    {
      name: '3B',
      value: 'triples'
    },
    {
      name: 'HR',
      value: 'hr'
    },
    {
      name: 'RBI',
      value: 'rbi'
    },
    {
      name: 'Runs',
      value: 'runs'
    },
    {
      name: 'BB',
      value: 'walks'
    },
    {
      name: 'SB',
      value: 'sb'
    }
  ];

  teamProps = this.getTeamProps('');

  constructor(
    private http: TransferHttp,
    private commonService: CommonService,
    private inputPanelService: InputPanelService,
    private spinnerService: SpinnerService,
  ) { }

  getMatchupProps(data) {
    const matchupProps = _.cloneDeep(this.matchupProps);
    matchupProps.forEach((item, i, arr) => {
      arr[i].ddOptions = data[item.value];
    });
    return matchupProps;
  }

  getTeamProps(team) {
    return [
      {
        name: 'Team Total',
        value: `${team}_team_total`
      },
      {
        name: 'Win',
        value: `${team}_team_win`,
        hideRange: true,
        inputType: 'dd',
        ddOptions: [
          true, false
        ],
        fixedCondition: true
      },
      {
        name: 'Spread',
        value: `${team}_team_spread`,
        inputType: 'plusInput'
      },
      {
        name: 'Moneyline',
        value: `${team}_team_moneyline`,
        inputType: 'plusInput',
        fixedCondition: true
      }
    ];
  }

  getPreSelectedGameId() {
    return this.preSelectedGameId;
  }

  setPreSelectedGameId(id: number) {
    this.preSelectedGameId = id;
  }

  removePreSelectedGameId() {
    this.preSelectedGameId = null;
  }


  getSingleBetPrediction(id: string, model) {
    const endpoint = `${environment.api_url}/mlb/fetch/bet-predictor/${id}/${model}`;
    // const endpoint = `${environment.api_url}/mlb/fetch/bet-predictor/55555/knn`;
    return this.http.get(endpoint);
  }

  getPredictedBets(id: string) {
    const endpoint = `${environment.api_url}/mlb/fetch/predicted-bets/${id}`;
    // const endpoint = `${environment.api_url}/mlb/fetch/predicted-bets/55555`;
    return this.http.get(endpoint).pipe(
      map((res: any) => {
        return res;
      }));
  }


  updatePredictedBets(id: string, body) {
    const endpoint = `${environment.api_url}/mlb/fetch/predicted-bets/${id}`;
    // const endpoint = `${environment.api_url}/mlb/fetch/predicted-bets/55555`;
    return this.http.post(endpoint, body);
  }

  saveSingleBetPrediction(id: string, body: any) {
    const endpoint = `${environment.api_url}/mlb/fetch/bet-predictor/${id}`;
    // const endpoint = `${environment.api_url}/mlb/fetch/bet-predictor/55555`;
    return this.http.post(endpoint, body).pipe(
      catchError(err => {
        this.commonService.showNotification(
          'Bet Predictor can not complete the requested update. ' +
          'Please click the Reset button below to clear the tool and start again.',
          'Unexpected Error', 'Reset')
          .result.then(() => {
            this.spinnerService.handleAPICall(
              this.saveSingleBetPrediction(id, {
                model_type: body.model_type,
                reset: true
              })
            )
            .subscribe(res => {
              this.inputPanelService.setBetPrediction(res);
            });
          })
          .catch(() => {});
        return observableThrowError(err);
      }));
  }

  savePredictedCard(isSaved: boolean, cardId: number) {
    const body = {
      bet_id: cardId
    };
    const endpoint = `${environment.api_url}/mlb/fetch/saved-bets`;
    return this.http.put(endpoint, body).pipe(
      map(() => {
        this.predictedBetCardWasSaved.next({cardId, isSaved})
      }));
  }

  deletePredictedBetsTab(tabId: number) {
    const body = {
      tab_id: tabId
    };
    const endpoint = `${environment.api_url}/mlb/fetch/predicted-bets`;
    return this.http.patch(endpoint, body);
  }

  deleteSavedBetsTab(tabId: number) {
    const body = {
      tab_id: tabId
    };
    const endpoint = `${environment.api_url}/mlb/fetch/saved-bets`;
    return this.http.patch(endpoint, body);
  }

  getBetPredictorMatchups() {
    const endpoint = `${environment.api_url}/mlb/fetch/matchups/bet_predictor`;
    return this.http.get(endpoint).pipe(
      map(res => res));
  }

  getSavedBets() {
    const endpoint = `${environment.api_url}/mlb/fetch/saved-bets`;
    return this.http.post(endpoint, {});
  }
}
