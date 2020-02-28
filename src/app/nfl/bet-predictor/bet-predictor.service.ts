
import {throwError as observableThrowError,  Subject ,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import * as _ from 'lodash'
import { environment } from 'environments/environment';
import { CommonService } from '../../shared/services/common.service';
import { InputPanelService } from '../../shared/modals/input-panel-modal/input-panel.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { LogoPipe } from '../../shared/pipes/logo.pipe';

interface Prop {
  name: string,
  value: string,
  hideRange?: boolean,
  inputType?: string,
  ddOptions?: any,
  fixedCondition?: boolean,
  canBeFloatOnEqual?: boolean,
  intOnly?: boolean,
  min?: number,
  max?: number
}

@Injectable({
  providedIn: 'root'
})
export class NflBetPredictorService {
  predictedBetCardWasSaved = new Subject();
  predictedBetTabWasDeleted = new Subject();
  savedBetTabWasDeleted = new Subject();

  quarterbackProps: Prop[] = [
    {
      name: 'Snaps',
      value: 'snaps'
    },
    {
      name: 'Comp',
      value: 'passing_completions'
    },
    {
      name: 'Att',
      value: 'passing_attempts'
    },
    {
      name: 'Pass Yds',
      value: 'passing_yards'
    },
    {
      name: 'TD',
      value: 'passing_touchdowns'
    },
    {
      name: 'INT',
      value: 'passing_interceptions'
    },
    {
      name: 'TOP',
      value: 'possession_time',
      inputType: 'hourMinutePicker',
      intOnly: true,
      min: 0,
      max: 60
    },
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
      name: 'Wind',
      value: 'wind',
      hideRange: true,
      inputType: 'dd',
      ddOptions: [],
      fixedCondition: true
    },
    {
      name: 'Temperature',
      value: 'temperature',
      hideRange: true,
      inputType: 'dd',
      ddOptions: [],
      fixedCondition: true
    },
  ];

  runningbackProps: Prop[] = [
    {
      name: 'Depth',
      value: 'depth',
      hideRange: true,
      canBeFloatOnEqual: false,
      fixedCondition: true,
      inputType: 'number',
      min: 1,
      max: null
    },
    {
      name: 'Snaps',
      value: 'snaps'
    },
    {
      name: 'Rushes',
      value: 'rushing_attempts'
    },
    {
      name: 'Rush Yds',
      value: 'rushing_yards'
    },
    {
      name: 'Rush TD',
      value: 'rushing_touchdowns'
    },
    {
      name: 'Tgts',
      value: 'receiving_targets'
    },
    {
      name: 'Rec',
      value: 'receptions'
    },
    {
      name: 'Rec Yds',
      value: 'receiving_yards'
    },
    {
      name: 'Rec TD',
      value: 'receiving_touchdowns'
    },
    {
      name: 'Fum',
      value: 'fumbles'
    }
  ];

  wideReceiverProps: Prop[] = [
    {
      name: 'Depth',
      value: 'depth',
      hideRange: true,
      canBeFloatOnEqual: false,
      fixedCondition: true,
      inputType: 'number',
      min: 1,
      max: null
    },
    {
      name: 'Snaps',
      value: 'snaps'
    },
    {
      name: 'Targets',
      value: 'receiving_targets'
    },
    {
      name: 'Rec',
      value: 'receptions'
    },
    {
      name: 'Rec Yds',
      value: 'receiving_yards'
    },
    {
      name: 'Rec TD',
      value: 'receiving_touchdowns'
    },
    {
      name: 'Fum',
      value: 'fumbles'
    }
  ];

  tightEndProps: Prop[] = [
    {
      name: 'Depth',
      value: 'depth',
      hideRange: true,
      canBeFloatOnEqual: false,
      fixedCondition: true,
      inputType: 'number',
      min: 1,
      max: null
    },
    {
      name: 'Snaps',
      value: 'snaps'
    },
    {
      name: 'Targets',
      value: 'receiving_targets'
    },
    {
      name: 'Rec',
      value: 'receptions'
    },
    {
      name: 'Rec Yds',
      value: 'receiving_yards'
    },
    {
      name: 'Rec TD',
      value: 'receiving_touchdowns'
    },
    {
      name: 'Fum',
      value: 'fumbles'
    }
  ];

  teamDefenseProps: Prop[] = [
    {
      name: 'Tackles',
      value: 'tackles'
    },
    {
      name: 'TFL',
      value: 'tackles_for_loss'
    },
    {
      name: 'Sacks',
      value: 'sacks'
    },
    {
      name: 'INT',
      value: 'interceptions'
    },
    {
      name: 'FF',
      value: 'forced_fumbles'
    },
    {
      name: 'TD',
      value: 'defensive_touchdowns'
    }
  ];

  kickerProps: Prop[] = [
    {
      name: 'FGM',
      value: 'field_goals_made'
    },
    {
      name: 'FGA',
      value: 'field_goals_attempted'
    },
    {
      name: 'XPM',
      value: 'extra_points_made'
    },
    {
      name: 'XPA',
      value: 'extra_points_attempted'
    },
  ];

  teamProps = this.getTeamProps('');

  constructor(
    private commonService: CommonService,
    private inputPanelService: InputPanelService,
    private logoPipe: LogoPipe,
    private spinnerService: SpinnerService,
    private http: TransferHttp
  ) { }

  getPlayerProps(propsName, maxDepth) {
    if (propsName === 'wideReceiverProps' || propsName === 'tightEndProps' || propsName === 'runningbackProps') {
      const depthIndex = _.findIndex(this[propsName], {value: 'depth'});
      const propsNameArr = _.cloneDeep(this[propsName]);
      propsNameArr[depthIndex].max = maxDepth;
      return propsNameArr;
    }
    return this[propsName];
  }

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

  getSingleBetPrediction(url: string, model) {
    const endpoint = `${environment.api_url}/nfl/fetch/bet-predictor/${url}/${model}`;
    // const endpoint = `${environment.api_url}/nfl/fetch/bet-predictor/201710924/logreg`;
    return this.http.get(endpoint);
  }

  getPredictedBets(url: string) {
    const endpoint = `${environment.api_url}/nfl/fetch/predicted-bets/${url}`;
    // const endpoint = `${environment.api_url}/nfl/fetch/predicted-bets/201710924`;
    return this.http.get(endpoint).pipe(
      map((res: any) => {
        return res;
      }));
  }

  getGames() {
    const endpoint = `${environment.api_url}/nfl/fetch/depth_charts/gateway/bet-predictor`;
    return this.http.get(endpoint).pipe(
      map((res: any) => {
        if (res && Array.isArray(res.depth_charts) && res.depth_charts.length) {
          res.depth_charts = res.depth_charts.map(dp => {
            if (!dp.away_white_logo) {
              dp.away_white_logo = this.logoPipe.transform(dp.away_route, 'nfl', 'white');
            }
            if (!dp.home_white_logo) {
              dp.home_white_logo = this.logoPipe.transform(dp.home_route, 'nfl', 'white');
            }
            return dp;
          });
        }
        return res;
      }));
  }


  updatePredictedBets(url: string, body) {
    const endpoint = `${environment.api_url}/nfl/fetch/predicted-bets/${url}`;
    // const endpoint = `${environment.api_url}/nfl/fetch/predicted-bets/201710924`;
    return this.http.post(endpoint, body);
  }

  saveSingleBetPrediction(url: string, body: any) {
    const endpoint = `${environment.api_url}/nfl/fetch/bet-predictor/${url}`;
    // const endpoint = `${environment.api_url}/nfl/fetch/bet-predictor/201710924`;
    return this.http.post(endpoint, body).pipe(
      catchError(err => {
        this.commonService.showNotification(
          'Bet Predictor can not complete the requested update. ' +
          'Please click the Reset button below to clear the tool and start again.',
          'Unexpected Error', 'Reset')
          .result.then(() => {
            this.spinnerService.handleAPICall(
              this.saveSingleBetPrediction(url, {
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
    const endpoint = `${environment.api_url}/nfl/fetch/saved-bets`;
    return this.http.put(endpoint, body).pipe(
      map(()=> {
        this.predictedBetCardWasSaved.next({cardId, isSaved})
      }));
  }

  deletePredictedBetsTab(tabId: number) {
    const body = {
      tab_id: tabId
    };
    const endpoint = `${environment.api_url}/nfl/fetch/predicted-bets`;
    return this.http.patch(endpoint, body);
  }

  deleteSavedBetsTab(tabId: number) {
    const body = {
      tab_id: tabId
    };
    const endpoint = `${environment.api_url}/nfl/fetch/saved-bets`;
    return this.http.patch(endpoint, body);
  }

  getSavedBets() {
    const endpoint = `${environment.api_url}/nfl/fetch/saved-bets`;
    return this.http.post(endpoint, {});
  }
}
