import {
  Component, Inject, Injector, Input, OnDestroy, OnInit, PLATFORM_ID, QueryList,
  ViewChildren
} from '@angular/core';
import { NgbActiveModal, NgbModal, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { InputPanelService } from './input-panel.service';
import { BetPredictorService } from '../../../mlb/bet-predictor/bet-predictor.service';
import { NflBetPredictorService } from '../../../nfl/bet-predictor/bet-predictor.service';
import { SpinnerService } from '../../components/spinner/spinner.service';
import { Subscription , Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { isPlatformBrowser, PlatformLocation } from '@angular/common';
import { VideoModalComponent } from '../video-modal/video-modal.component';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-input-panel-modal',
  templateUrl: './input-panel-modal.component.html',
  styleUrls: ['./input-panel-modal.component.scss'],
  providers: [NgbPopoverConfig]
})
export class InputPanelModalComponent implements OnInit, OnDestroy {
  @Input() data: any;
  betChangesSubscription: Subscription;
  originData: any;
  dataToChange: any;
  sliderMessages: any[];
  activeDDs = {
    team: null,
    player: {
      type: null,
      item: null
    }
  };
  activeTab: string;
  availableTabs = [
    'player',
    'team',
    'matchup'
  ];

  conditions = [
    {
      name: 'Does Not Equal ≠',
      value: 0
    },
    {
      name: 'Equals =',
      value: 1
    },
    {
      name: 'Greater Than >',
      value: 2
    },
    {
      name: 'Less Than <',
      value: 3
    },
    {
      name: 'Greater Equal ≥',
      value: 4
    },
    {
      name: 'Less Equal ≤',
      value: 5
    }
  ];

  @ViewChildren('popover') popovers: any;

  betPredictorService;
  private modalService;

  constructor(
    public activeModal: NgbActiveModal,
    private inputPanelService: InputPanelService,
    private mlbBetPredictorService: BetPredictorService,
    private nflBetPredictorService: NflBetPredictorService,
    private spinnerService: SpinnerService,
    private commonService: CommonService,
    private location: PlatformLocation,
    config: NgbPopoverConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService = this.injector.get(NgbModal);
    }
    config.triggers = 'hover';
    location.onPopState(() => {
      // ensure that modal is opened
      if (this.activeModal !== undefined) {
        this.activeModal.close();
      }
    });
  }

  ngOnInit() {
    if (this.data && this.data.league === 'mlb') {
      this.betPredictorService = this.mlbBetPredictorService;
    } else if (this.data && this.data.league === 'nfl') {
      this.betPredictorService = this.nflBetPredictorService;
    }
    this.sliderMessages = this.inputPanelService.getSliderMessages();
    this.dataToChange = _.cloneDeep(this.data);
    console.log(this.dataToChange);
    if (this.dataToChange.mode === 'multiple') {
      if (this.dataToChange.team) {
        this.activeDDs.team = this.dataToChange.team;
        this.activeTab = this.availableTabs[1];
        if (this.dataToChange.player && this.dataToChange.player.type && this.dataToChange.player.item) {
          this.selectPlayer(this.dataToChange.player.item, this.dataToChange.player.type);
          this.activeTab = this.availableTabs[0];
        }
      } else {
        this.activeDDs.team = 'away';
        this.activeTab = this.availableTabs[1];
        this.selectTeam(this.activeDDs.team);
      }
    } else {
      if (this.dataToChange.playerType === 'team') {
        this.activeTab = this.availableTabs[1];
      } else {
        this.activeTab = this.availableTabs[0];
      }
      this.handleInitalConditional();
      this.originData = _.cloneDeep(this.dataToChange);
    }

    this.betChangesSubscription = this.inputPanelService.betPredictionChanged
      .subscribe((betPrediction) => {
        if (!betPrediction.error) {
          this.closeAllPopovers();
          if (this.dataToChange.mode === 'multiple') {
            this.dataToChange.betPredictionData = _.cloneDeep(betPrediction);
            this.originData.betPredictionData = _.cloneDeep(betPrediction);
            if (this.dataToChange.playerType !== 'team') {
              const item = _.find(betPrediction[this.activeDDs.team][this.dataToChange.playerType],
                {player_id: this.dataToChange.innerData.item.player_id});
              this.dataToChange.innerData.item = _.cloneDeep(item);
              if (this.dataToChange.player && this.dataToChange.player.type && this.dataToChange.player.item) {
                this.dataToChange.player.item = _.cloneDeep(item);
              }
              this.handleInitalConditional();
              this.originData.innerData.item = _.cloneDeep(this.dataToChange.innerData.item);
              if (this.originData.player && this.originData.player.type && this.originData.player.item) {
                this.originData.player.item = _.cloneDeep(item);
              }
            } else if (this.dataToChange.playerType === 'team') {
              this.dataToChange.innerData.item = _.cloneDeep(betPrediction['bet_predictor']);
              this.handleInitalConditional();
              this.originData.innerData.item = _.cloneDeep(this.dataToChange.innerData.item);
            }
          } else {
            if (this.dataToChange.playerType !== 'team') {
              const item = _.find(betPrediction[this.dataToChange.team][this.dataToChange.playerType],
                {player_id: this.dataToChange.innerData.item.player_id});
              this.dataToChange.innerData.item = _.cloneDeep(item);
              this.handleInitalConditional();
              this.originData.innerData.item = _.cloneDeep(this.dataToChange.innerData.item);
            } else {
              this.dataToChange.innerData.item = _.cloneDeep(betPrediction['bet_predictor']);
              this.handleInitalConditional();
              this.originData.innerData.item = _.cloneDeep(this.dataToChange.innerData.item);
            }
          }
        }
      });
  }

  ngOnDestroy() {
    this.betChangesSubscription.unsubscribe();
  }

  getTeamDDValue() {
    let resValue;
    const betPredictor = this.dataToChange.betPredictionData.bet_predictor;
    switch (this.activeDDs.team) {
      case 'away':
        resValue = betPredictor.away_team_name;
        break;
      case 'home':
        resValue = betPredictor.home_team_name;
        break;
      case 'matchup':
        resValue = `${betPredictor.away_team_name} @ ${betPredictor.home_team_name}`;
        break;
      default:
        break;
    }
    return resValue;
  }

  selectPlayer(item: any, playerType: string) {
    this.activeDDs.player.type = playerType;
    this.dataToChange.playerType = playerType;
    this.activeDDs.player.item = item;
    this.dataToChange.innerData = {
      item: _.cloneDeep(this.activeDDs.player.item)
    };
    if (this.originData) {
      this.originData.innerData = {};
    }
    switch (this.activeDDs.player.type) {
      case 'pitchers': {
        this.dataToChange.innerData.propsNames = this.betPredictorService.pitcherProps;
        break;
      }
      case 'batters': {
        this.dataToChange.innerData.propsNames = this.betPredictorService.batterProps;
        break;
      }
      case 'qb': {
        this.dataToChange.innerData.propsNames = this.betPredictorService.quarterbackProps;
        break;
      }
      case 'rb': {
        this.dataToChange.innerData.propsNames = this.betPredictorService.getPlayerProps(
          'runningbackProps',
          this.dataToChange.betPredictionData.depths[this.activeDDs.team][this.activeDDs.player.type]
        );
        break;
      }
      case 'te': {
        this.dataToChange.innerData.propsNames = this.betPredictorService.getPlayerProps(
          'tightEndProps',
          this.dataToChange.betPredictionData.depths[this.activeDDs.team][this.activeDDs.player.type]
        );
        break;
      }
      case 'def': {
        this.dataToChange.innerData.propsNames = this.betPredictorService.teamDefenseProps;
        break;
      }
      case 'k': {
        this.dataToChange.innerData.propsNames = this.betPredictorService.kickerProps;
        break;
      }
      case 'wr': {
        this.dataToChange.innerData.propsNames = this.betPredictorService.getPlayerProps(
          'wideReceiverProps',
          this.dataToChange.betPredictionData.depths[this.activeDDs.team][this.activeDDs.player.type]
        );
        break;
      }
    }
    this.activeTab = this.availableTabs[0];
    this.handleInitalConditional();
    this.originData = _.cloneDeep(this.dataToChange);
  }

  selectTeam(val: string, hasPlayer = false) {
    this.dataToChange.playerType = 'team';
    this.activeDDs.team = val;
    this.dataToChange.innerData = {};
    if ( this.originData) {
      this.originData.innerData = {};
    }
    if (!hasPlayer) {
      this.activeDDs.player = {
        type: null,
        item: {}
      };
    }
    if (val === 'matchup') {
      this.dataToChange.innerData.propsNames = this.betPredictorService.getMatchupProps(this.dataToChange.betPredictionData);
      this.dataToChange.innerData.item = _.cloneDeep(this.dataToChange.betPredictionData.bet_predictor);
      this.activeTab = this.availableTabs[2];
    } else {
      this.dataToChange.innerData.propsNames = this.betPredictorService.getTeamProps(val);
      this.dataToChange.innerData.item = _.cloneDeep(this.dataToChange.betPredictionData.bet_predictor);
      this.activeTab = this.availableTabs[1];
    }
    this.handleInitalConditional();
    this.originData = _.cloneDeep(this.dataToChange);
  }

  private handleInitalConditional() {
    this.dataToChange.innerData.propsNames.forEach((prop) => {
      const conditional = this.dataToChange.innerData.item[prop.value + '_conditional'];
      if (typeof conditional === 'undefined') {
        this.dataToChange.innerData.item[prop.value + '_conditional'] = 1;
        // conditional = 1;
      }
      if (prop.inputType === 'hourMinutePicker') {
        this.updateTimepicker(prop, true);
      }
      // if (prop.inputType !== 'dd' && (conditional === 1 || prop.fixedCondition)) {
      //   this.afterUserManualInput(conditional, prop)
      // }
    });
  }

  onSelectTab(tabName: string) {
    this.activeTab = tabName;
    if (tabName === 'team') {
      this.selectTeam(this.activeDDs.team, true);
    }
    if (tabName === 'player') {
      this.selectPlayer(this.activeDDs.player.item, this.activeDDs.player.type);
    }
  }

  private repareDataToSave() {
    const diff: any = this.inputPanelService.getDiff(this.dataToChange, this.originData);
    if (diff && diff.innerData && diff.innerData.item) {
      if (this.dataToChange.playerType !== 'team') {
          const dataToSend = {
            // game_id: 1,
            model_type: this.dataToChange.predictiveModel,
            players: []
          };
          const playerChanges = {
            player_id: this.dataToChange.innerData.item.player_id,
            inputs: []
          };
          playerChanges.inputs = this.inputPanelService.generatePlayerChangedValuesArr(
            diff.innerData.item, this.dataToChange.innerData.item, this.dataToChange.playerType === 'pitchers'
          );
          dataToSend.players.push(playerChanges);
          console.log('this.dataToChange', this.dataToChange);
          console.log('this.originData', this.originData);
          console.log('diff', diff);
          console.log('dataToSend', dataToSend);
          return dataToSend;
      } else if (this.dataToChange.playerType === 'team') {
        const dataToSend = {
          // game_id: 1,
          model_type: this.dataToChange.predictiveModel,
          matchup: {}
        };
        dataToSend.matchup = this.inputPanelService.generateMatchupChangedValues(
          diff.innerData.item, this.dataToChange.innerData.item
        );
        console.log('this.dataToChange', this.dataToChange);
        console.log('this.originData', this.originData);
        console.log('diff', diff);
        console.log('dataToSend', dataToSend);
        return dataToSend;
      }
    }
  }

  onInput() {
    const data = this.repareDataToSave();
    if (data) {
      this.spinnerService.handleAPICall(this.betPredictorService.saveSingleBetPrediction(this.dataToChange.selectedMatcupUrl, data))
        .subscribe(res => {
          console.log('saveSingleBetPrediction', res);
          this.inputPanelService.setBetPrediction(res);
        });
    }
  }

  onSave() {
    const data = this.repareDataToSave();
    if (data) {
      this.spinnerService.showSpinner();
      this.betPredictorService.saveSingleBetPrediction(this.dataToChange.selectedMatcupUrl, data)
        .pipe(
          catchError(err => {
            this.spinnerService.hideSpinner();
            throw err;
          })
        )
        .subscribe(res => {
          console.log('saveSingleBetPrediction', res);
          this.inputPanelService.setBetPrediction(res);
          if (!res.error) {
            this.betPredictorService.updatePredictedBets(this.dataToChange.selectedMatcupUrl, {
              model_type: data.model_type
            }).pipe(
                catchError(err => {
                  this.spinnerService.hideSpinner();
                  throw err;
                })
              )
              .subscribe(response => {
                this.spinnerService.hideSpinner();
                this.inputPanelService.updatePredictedBets(response);
                this.activeModal.dismiss();
                console.log('updatePredictedBets', response);
              });
          } else {
            this.spinnerService.hideSpinner();
          }
        });
    } else {
      this.spinnerService.handleAPICall(this.betPredictorService.updatePredictedBets(this.dataToChange.selectedMatcupUrl, {
        model_type: this.dataToChange.predictiveModel
      }))
        .subscribe(response => {
          this.inputPanelService.updatePredictedBets(response);
          this.activeModal.dismiss();
          console.log('updatePredictedBets', response);
        });
    }
  }

  isBoolean(val) {
    return typeof val === 'boolean';
  }

  setRangeValue(prop) {
    let currentValue;
    if (!prop.canBeFloatOnEqual && (this.dataToChange.innerData.item[prop.value + '_conditional'] === 1 || prop.fixedCondition)) {
      currentValue = Math.round(this.dataToChange.innerData.item[prop.value]);
    } else {
      currentValue = this.dataToChange.innerData.item[prop.value];
    }
    const values = this.getRangeValues(this.originData.innerData.item, prop);
    const index = this.getClosestNumIndex(values, currentValue);
    return index;
  }

  rangeChange(prop, value) {
    const values = this.getRangeValues(this.originData.innerData.item, prop);
    if (!prop.canBeFloatOnEqual && (this.dataToChange.innerData.item[prop.value + '_conditional'] === 1 || prop.fixedCondition)) {
      this.dataToChange.innerData.item[prop.value] = Math.round(values[value].value);
    } else {
      this.dataToChange.innerData.item[prop.value] = values[value].value;
    }
    if (prop.inputType === 'hourMinutePicker') {
      this.updateTimepicker(prop, true);
    }
  }

  changeArrowValue(prop, direction) {
    const currentValue = this.dataToChange.innerData.item[prop.value];
    const values = this.getRangeValues(this.originData.innerData.item, prop);
    const index = this.getClosestNumIndex(values, currentValue);
    let res;
    if (direction === 'up') {
      res = values[index + 1];
    } else {
      res = values[index - 1];
    }
    if (!res && direction === 'up') {
      res = values[values.length - 1];
    }
    if (!res && direction === 'down') {
      res = values[0];
    }
    if (res) {
      this.dataToChange.innerData.item[prop.value] = res.value;
    }
    if (prop.inputType === 'hourMinutePicker') {
      this.updateTimepicker(prop, true);
    }
  }

  onRangeLegendClick(prop, propToSet: string) {
    if (propToSet === 'current') {
      if (!prop.canBeFloatOnEqual && (this.dataToChange.innerData.item[prop.value + '_conditional'] === 1 || prop.fixedCondition)) {
        this.dataToChange.innerData.item[prop.value] = Math.round(this.originData.innerData.item[prop.value]);
      } else {
        this.dataToChange.innerData.item[prop.value] = this.originData.innerData.item[prop.value];
      }
    } else {
      this.dataToChange.innerData.item[prop.value] = this.getItemValDependOnCondition(
        prop,
        this.originData.innerData.item[prop.value + propToSet],
        propToSet.slice(1)
      );
    }
    if (prop.inputType === 'hourMinutePicker') {
      this.updateTimepicker(prop, true);
    }
  }

  disabledArrow(prop) {
    const currentValue = this.dataToChange.innerData.item[prop.value];
    const values = this.getRangeValues(this.originData.innerData.item, prop);
    if (values.length < 2) {
      return 'disabled';
    }
    if (currentValue === values[0].value) {
      return 'disabled-down';
    }
    if (currentValue === values[values.length - 1].value) {
      return 'disabled-up';
    }
    // if (!_.find(values, {value: currentValue})) {
    //   return 'disabled';
    // }
    return '';
  }

  getRangeValues(item, prop) {
    let sourceArr = [
      {
        value: this.getItemValDependOnCondition(prop, item[prop.value + '_min'], 'min'),
        optionType: 'min'
      },
      {
        value: this.getItemValDependOnCondition(prop, item[prop.value + '_bad']),
        optionType: 'bad'
      },
      {
        value: this.getItemValDependOnCondition(prop, item[prop.value]),
        optionType: 'initial'
      },
      {
        value: this.getItemValDependOnCondition(prop, item[prop.value + '_good']),
        optionType: 'good'
      },
      {
        value: this.getItemValDependOnCondition(prop, item[prop.value + '_max'], 'max'),
        optionType: 'max'
      }
    ];
    sourceArr = sourceArr.filter(arrItem => typeof arrItem.value !== 'undefined');
    const resArr = _.uniqBy(sourceArr, 'value');
    const maxOptionIndex = _.findIndex(resArr, {optionType: 'max'});
    const goodOptionIndex = _.findIndex(resArr, {optionType: 'good'});
    const maxOptionSource = _.find(sourceArr, {optionType: 'max'});
    const goodOptionSource = _.find(sourceArr, {optionType: 'good'});
    if (maxOptionSource && goodOptionSource &&
      maxOptionIndex === -1 && goodOptionIndex !== -1 &&
      maxOptionSource.value === goodOptionSource.value) {
      resArr[goodOptionIndex].optionType = 'max';
    }
    if (!_.find(resArr, {optionType: 'initial'})) {
      resArr.forEach((rangeItem, i, arr) => {
        if (rangeItem.value === sourceArr[2].value) {
          arr[i] = sourceArr[2];
        }
      })
    }
    return resArr;
  }

  checkRangeOptionExist(optionType: string, prop): boolean {
    const props = this.getRangeValues(this.originData.innerData.item, prop);
    return !Boolean(_.find(props, {optionType}));
  }

  isLastSliderOption(optionType: string, prop): boolean {
    const props = this.getRangeValues(this.originData.innerData.item, prop);
    return props[props.length - 1].optionType === optionType;
  }

  selectCondition(conditionValue, prop) {
    this.dataToChange.innerData.item[prop.value + '_conditional'] = conditionValue;
    this.afterUserManualInput(conditionValue, prop);
  }

  onUserManualInput(condition, event: any, prop) {
    if (prop.intOnly || (!prop.canBeFloatOnEqual && (condition === this.conditions[1].value || prop.fixedCondition))) {
      const charPattern = /[0-9\+\-\ ]/;
      const valuePattern = /^\d+$/;
      const inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode !== 8 && (!charPattern.test(inputChar))) {
        return event.preventDefault();
      }
      let currentValue = event.currentTarget.value;
      if (prop.inputType === 'plusInput' && currentValue.indexOf('+') === 0) {
        currentValue = currentValue.substr(1);
      }
      if (currentValue.indexOf('-') === 0) {
        currentValue = currentValue.substr(1);
      }
      if (currentValue !== '' && !valuePattern.test(currentValue)) {
        return event.preventDefault();
      }
    }
  }

  afterUserManualInput(conditionValue, prop) {
    if (prop.intOnly || (!prop.canBeFloatOnEqual && (conditionValue === this.conditions[1].value || prop.fixedCondition))) {
      const currentValue = this.dataToChange.innerData.item[prop.value];
      if (currentValue !== '-' && isNaN(currentValue)) {
        this.dataToChange.innerData.item[prop.value] = 0;
      } else if (currentValue != null && currentValue !== '' && currentValue !== '-' && !isNaN(currentValue)) {
        let values;
        if (this.originData && this.originData.innerData && this.originData.innerData.item) {
          values = this.getRangeValues(this.originData.innerData.item, prop);
        } else {
          values = this.getRangeValues(this.dataToChange.innerData.item, prop);
        }
        if (this.getClosestNumIndex(values, currentValue) === 0) {
          this.dataToChange.innerData.item[prop.value] = this.getItemValDependOnCondition(prop, currentValue, 'min');
        } else if (this.getClosestNumIndex(values, currentValue) === values.length - 1) {
          this.dataToChange.innerData.item[prop.value] = this.getItemValDependOnCondition(prop, currentValue, 'max');
        } else {
          this.dataToChange.innerData.item[prop.value] = this.getItemValDependOnCondition(prop, currentValue);
        }
      }
    } else if (prop.inputType === 'plusInput') {
      const currentValue = this.dataToChange.innerData.item[prop.value];
      if (isNaN(currentValue)) {
        this.dataToChange.innerData.item[prop.value] = 0;
      }
    }
  }

  setInputPlus(propVal, value) {
    if (!isNaN(Number(value))) {
      return this.dataToChange.innerData.item[propVal] = Number(value);
    }
  }

  showSliderPopupValue(name) {
    return _.find(this.sliderMessages, {name}).value;
  }

  inputDisabled(prop) {
    return this.checkRangeOptionExist('min', prop) &&
      this.checkRangeOptionExist('bad', prop) &&
      this.checkRangeOptionExist('good', prop) &&
      this.checkRangeOptionExist('max', prop);
  }

  showPopover(form, index, popover) {
    setTimeout(() => {
      if (!form || !form.controls || !form.controls['input' + index] || !form.controls['input' + index]) {
        return;
      }
      const errors = form.controls['input' + index].errors;
      if (errors && !_.isEmpty(errors)) {
        if (popover.isOpen()) {
          popover.close();
        }
        if (errors['required'] || errors['numberOnly']) {
          popover.open({error: 'Enter a valid number'});
        } else {
          popover.open({error: 'This scenario does not exist'});
        }
      } else if (popover.isOpen()) {
        popover.close();
      }
    }, 100);
  }

  getItemValDependOnCondition(prop, valueToRound, minOrMax?: string) {
    if (!prop.canBeFloatOnEqual && (this.dataToChange.innerData.item[prop.value + '_conditional'] === 1 || prop.fixedCondition)) {
      return this.commonService.roundValDependOnEdge(valueToRound, minOrMax);
    }
    return valueToRound;
  }

  private getClosestNumIndex(arr: {value: number, optionType: string}[], num: number) {
    const initial = _.find(arr, {optionType: 'initial'}).value;
    let closest, closestDiff, currentDiff, resIndex;
    if (arr.length) {
      closest = arr[0].value;
      resIndex = 0;
      for (let i = 0; i < arr.length; i++) {
        closestDiff = Math.abs(num - closest);
        currentDiff = Math.abs(num - arr[i].value);
        if (currentDiff < closestDiff || (num < initial && currentDiff <= closestDiff)) {
          closest = arr[i].value;
          resIndex = i;
        }
        closestDiff = null;
        currentDiff = null;
      }
      // returns first element index that is closest to number
      return resIndex;
    }
    // no length
    return false;
  }

  private updateTimepicker(prop, updateInputs = false) {
    if (updateInputs) {
      const time = this.secondsToMinutes(this.dataToChange.innerData.item[prop.value]).split(':');
      this.setTimeToModel(prop.value + '_hour_dont_send', parseInt(time[0], 10));
      this.setTimeToModel(prop.value + '_minute_dont_send', parseInt(time[1], 10));
    } else {
      const hours = this.dataToChange.innerData.item[prop.value + '_hour_dont_send'];
      const minutes = this.dataToChange.innerData.item[prop.value + '_minute_dont_send'];
      this.dataToChange.innerData.item[prop.value] = this.minutesToSeconds(`${hours}:${minutes}`);
    }
  }

  validateMinutes(prop) {
    if (this.dataToChange.innerData.item[prop.value + '_hour_dont_send'] === 60) {
      this.dataToChange.innerData.item[prop.value + '_minute_dont_send'] = '00';
    }
  }

  getTime(time: number, type: string) { // 1 - seconds, 0 - minutes
    return parseInt(this.secondsToMinutes(time).split(':')[type], 10);
  }

  private secondsToMinutes(seconds: number): string {
    return (seconds - (seconds %= 60)) / 60 + ( 9 < seconds ? ':' : ':0') + seconds;
  }

  private minutesToSeconds(time: string): number {
    const timeArr = time.split(':');
    return (+timeArr[0]) * 60 + (+timeArr[1]);
  }

  onResetBtnClick() {
    this.spinnerService.handleAPICall(
      this.betPredictorService.saveSingleBetPrediction(this.dataToChange.selectedMatcupUrl, {
        model_type: this.dataToChange.predictiveModel,
        reset: true
      })
    ).subscribe(res => {
      console.log('saveSingleBetPrediction', res);
      this.inputPanelService.setBetPrediction(res);
    });
  }

  setTimeToModel(propVal, time) {
    if (parseInt(time, 10) < 10) {
      this.dataToChange.innerData.item[propVal] = '0' + time;
    } else {
      this.dataToChange.innerData.item[propVal] = String(Number(time));
    }
  }

  private closeAllPopovers() {
    for (let i = 0; i < this.popovers.length; i++) {
      if (this.popovers._results[i].isOpen()) {
        this.popovers._results[i].close();
      }
    }
  }

  onHowItWorksClick() {
    const modalRef = this.modalService.open(VideoModalComponent, {
      size: 'lg',
      windowClass: `lineups-custom-modal common-modal video-modal`
    });
    modalRef.componentInstance.src = 'https://www.youtube.com/embed/ye43pRAiPoE?rel=0';
  }
}
