import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import * as _ from 'lodash';
import { CommonService } from '../../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class InputPanelService {
  betPredictionChanged = new Subject<any>();
  predictedBetsUpdated = new Subject();
  private betPredictionData: any;

  constructor(private commonService: CommonService) {

  }

  updatePredictedBets(predictedBets) {
    this.predictedBetsUpdated.next(predictedBets);
  }

  getSliderMessages() {
    return this.commonService.createArrayFromNamedObj(this.betPredictionData.slider_messages, 'name', 'value')
  }

  setBetPrediction(betPredictionData: any) {
    let res;
    if (!betPredictionData.error) {
      if (!betPredictionData.weather) {
        betPredictionData.slider_messages = _.clone(this.betPredictionData.slider_messages);
        betPredictionData.rain = _.clone(this.betPredictionData.rain);
        betPredictionData.weather = _.clone(this.betPredictionData.weather);
        betPredictionData.wind_direction = _.clone(this.betPredictionData.wind_direction);
        betPredictionData.wind_speed = _.clone(this.betPredictionData.wind_speed);
      }
      this.betPredictionData = _.cloneDeep(betPredictionData);
      res = this.betPredictionData;
    } else {
      res = betPredictionData;
    }
    this.betPredictionChanged.next(_.cloneDeep(res));
  }

  getDiff(obj, origin) {
    return changes(obj, origin);

    function changes(object, base) {
      return _.transform(object, function(result, value, key) {
        if (typeof key === 'string' && (<string>key).indexOf('_dont_send') !== -1) {
          return;
        }
        if (!_.isEqual(value, base[key])) {
          result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    }
  }

  generatePlayerChangedValuesArr(diffItem, changedItem, isPitcher: boolean) {
    const changes = [];
    for (const key in diffItem) {
      if (diffItem.hasOwnProperty(key)) {
        if (key.indexOf('conditional') === -1) {
          const inputsChanges: any = {
            stat: `${isPitcher ? 'pitching_' : ''}${key}`,
            value: changedItem[key]
          };
          if (typeof changedItem[key + '_conditional'] === 'number') {
            inputsChanges.conditional = changedItem[key + '_conditional'];
          }
          changes.push(inputsChanges);
        } else if (!_.find(changes, {stat: `${isPitcher ? 'pitching_' : ''}${key.replace('_conditional', '')}` as any})) {
          const inputsChanges = {
            stat: `${isPitcher ? 'pitching_' : ''}${key.replace('_conditional', '')}`,
            value:  changedItem[key.replace('_conditional', '')],
            conditional:  changedItem[key]
          };
          changes.push(inputsChanges);
        }
      }
    }
    return changes;
  }

  generateMatchupChangedValues(diffItem, changedItem) {
    const matchup = {};
    for (const key in diffItem) {
      if (diffItem.hasOwnProperty(key)) {
        if (key.indexOf('conditional') === -1) {
          matchup[key] = {
            value: changedItem[key],
          };
          if (typeof changedItem[key + '_conditional'] === 'number') {
            matchup[key].conditional = changedItem[key + '_conditional'];
          }
        } else if (!diffItem[key.replace('_conditional', '')]) {
          matchup[key.replace('_conditional', '')] = {
            value: changedItem[key.replace('_conditional', '')],
            conditional: changedItem[key]
          };
        }
      }
    }
    return matchup;
  }

}
