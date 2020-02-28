
import {of as observableOf,  Observable } from 'rxjs';
import { Component, Inject, Injector, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BetPredictorService } from '../bet-predictor.service';
import { InputPanelModalComponent } from '../../../shared/modals/input-panel-modal/input-panel-modal.component';
import { PlayerNewsModalComponent } from '../../../shared/modals/player-news-modal/player-news-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import { InputPanelService } from '../../../shared/modals/input-panel-modal/input-panel.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { DataTable } from '@pascalhonegger/ng-datatable';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-team-lineup-table-editable',
  templateUrl: './team-lineup-table-editable.component.html',
  styleUrls: ['./team-lineup-table-editable.component.scss'],
  providers: [DataTable]
})
export class TeamLineupTableEditableComponent implements OnInit {
  _batters: any;
  @Input() teamName: string;
  @Input() teamConfirmed: boolean;
  @Input() teamRecord: string;
  @Input() teamLogo: string;
  @Input() teamTotal: string;
  @Input() teamTotalDiff: number;
  @Input() teamTotalDisplay;
  @Input() teamTotalDisplayConditional: string;
  @Input() teamWin: boolean;
  @Input() teamWinDiff;
  @Input() teamWinDisplay;
  @Input() teamWinDisplayConditional: string;
  @Input() teamSpread: string;
  @Input() teamSpreadDiff;
  @Input() teamSpreadDisplay;
  @Input() teamSpreadDisplayConditional: string;
  @Input() teamMoneyline: string;
  @Input() teamMoneylineDiff;
  @Input() teamMoneylineDisplay;
  @Input() teamMoneylineDisplayConditional: string;
  @Input() pitchers: any[];
  @Input() team: string; // home | away
  @Input() betPredictionData: any;
  @Input() matchup: any;
  @Input() predictiveModelValue: string;
  @Input() selectedMatcupUrl: string;
  @Input() set batters(batters) {
    this._batters = batters.sort((a, b) => {return a.order - b.order});
  };
  get batters() {
    return this._batters;
  }
  private modalService;
  pitcherProps: {name: string, value: string}[];
  batterProps: {name: string, value: string}[];
  teamProps: {name: string, value: string}[];

  onPitcherModalOpen = this.onPlayerModalOpen.bind(this, 'pitchers');
  onBatterModalOpen = this.onPlayerModalOpen.bind(this, 'batters');
  onTeamModalOpen = this.onPlayerModalOpen.bind(this, 'team');

  constructor(
    private betPredictorService: BetPredictorService,
    private inputPanelService: InputPanelService,
    private spinnerService: SpinnerService,
    private commonService: CommonService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService = this.injector.get(NgbModal);
    }
  }

  ngOnInit() {
    this.pitcherProps = this.betPredictorService.pitcherProps;
    this.batterProps = this.betPredictorService.batterProps;
    this.teamProps = this.betPredictorService.teamProps;
  }

  onArrowClick(item, isUp, playerType: string) {
    let direction;
    if (isUp) {
      direction = 1;
    } else {
      direction = 0;
    }
    const data = {
      model_type: this.predictiveModelValue,
      player: {
        player_id: item.player_id,
        direction,
      }
    };
    data.player[playerType + '_rating'] = item.rating;
    console.log('data', data);
    this.spinnerService.handleAPICall(this.betPredictorService.saveSingleBetPrediction(this.matchup.game_key, data))
      .subscribe(res => {
        this.inputPanelService.setBetPrediction(res);
        console.log('onArrowClick RES', res);
      })
  }

  onSwap(event) {
    console.log('onSwap', event);
    const data = {
      model_type: this.predictiveModelValue,
      replacements: {}
    };
    data.replacements[event['original'].player_id] = {
      'original': event['original'].order || null,
      'new': event['new_player'].order || null,
      'replacement': event['new_player'].player_id
    };
    data.replacements[event['new_player'].player_id] = {
      'original': event['new_player'].order || null,
      'new': event['original'].order || null,
      'replacement': event['original'].player_id
    };
    this.spinnerService.handleAPICall(this.betPredictorService.saveSingleBetPrediction(this.matchup.game_key, data))
      .subscribe(res => {
        this.inputPanelService.setBetPrediction(res);
        console.log('onSwap RES', res);
      })
  }

  pitcherDDFormatter(item: any) {
    const ratingClass = this.commonService.setRatingClass(item.rating);
    return `
    <table class="w-100" style="table-layout: fixed">
      <tbody>
        <tr class="text-center">
          <td width="7.1%%">
            <button class="btn team-swap-btn">${item.position}</button>
          </td>
          <td width="30.4%" class="text-left">
            ${item.name} (${item.hand})
          </td>
          <td width="7%%">
            <div class="rating-formatter ${ratingClass}">${item.rating}</div>
          </td>
          <td>${item.era}</td>
          <td width="9%">${item.strikeouts}</td>
          <td width="8%">${item.decision}</td>
          <td>${item.runs_allowed}</td>
          <td>${item.hits_allowed}</td>
          <td>${item.ip}</td>
          <td>${item.walks}</td>
        </tr>
      </tbody>
    </table>
    `;
  }

  hitterDDFormatter(item: any) {
    const ratingClass = this.commonService.setRatingClass(item.rating);
    return `
    <table class="w-100" style="table-layout: fixed">
      <tbody>
        <tr class="text-center">
          <td width="7.1%">
            <div class="w-100 h-100">
              <button class="btn team-swap-btn">${item.position}</button>
            </div>
          </td>
          <td width="30.3%" class="text-left px-1">
            ${item.name} (${item.hand})
          </td>
          <td width="7.1%">
            <div class="rating-formatter ${ratingClass}">${item.rating}</div>
          </td>
          <td width="7.1%">${item.order}</td>
          <td width="4.84%">${item.pa}</td>
          <td width="4.84%">${item.hits}</td>
          <td width="4.84%">${item.singles}</td>
          <td width="4.84%">${item.doubles}</td>
          <td width="4.84%">${item.triples}</td>
          <td width="4.84%">${item.hr}</td>
          <td width="4.84%">${item.rbi}</td>
          <td width="4.84%">${item.runs}</td>
          <td width="4.84%">${item.walks}</td>
          <td width="4.84%">${item.sb}</td>
        </tr>
      </tbody>
    </table>
    `;
  }

  onInputPanelClick(player: any, playerType: string) {
    const mode = 'multiple';
    const modalRef = this.modalService.open(InputPanelModalComponent, {
      size: 'lg',
      windowClass: `lineups-custom-modal input-panel-modal-${mode}`
    });
    modalRef.componentInstance.data = {
      league: 'mlb',
      selectedMatcupUrl: this.selectedMatcupUrl,
      predictiveModel: this.predictiveModelValue,
      mode,
      team: this.team,
      player: {
        item: player,
        type: playerType
      },
      betPredictionData: this.betPredictionData
    };
    modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${reason}`);
    });
  }

  onPlayerHistoryClick(isActive: boolean, id: number) {
    if (!isActive) {
      return;
    }
    const matchup = {
      homeName: `${this.betPredictionData.bet_predictor.nav.home_abbr} vs ${this.betPredictionData.bet_predictor.nav.away_abbr}`,
      awayName: `${this.betPredictionData.bet_predictor.nav.away_abbr} @ ${this.betPredictionData.bet_predictor.nav.home_abbr}`,
      homeLogo: this.betPredictionData.bet_predictor.nav.home_logo_white,
      awayLogo: this.betPredictionData.bet_predictor.nav.away_logo_white,
      time: moment(this.matchup.header.details.game_time).format('h:mm a')
    };
    let players = _.concat(
      this.betPredictionData.away.batters.map(player => {player.is_home = false; player.type = 'B'; return player}),
      this.betPredictionData.away.pitchers.map(player => {player.is_home = false; player.type = 'P'; return player}),
      this.betPredictionData.home.batters.map(player => {player.is_home = true; player.type = 'B'; return player}),
      this.betPredictionData.home.pitchers.map(player => {player.is_home = true; player.type = 'P'; return player})
    ).filter(player => player.has_news);
    players = players.map(player => {
      return {
        player_id: player.player_id,
        name: player.name,
        type: player.type,
        is_home: player.is_home,
      };
    });
    const modalRef = this.modalService.open(PlayerNewsModalComponent, {size: 'lg', windowClass: `lineups-custom-modal common-modal` });
    modalRef.componentInstance.data = {
      league: 'mlb',
      whiteLogos: true,
      players,
      matchup,
      selectedPlayerId: id
    };
  }


  private onPlayerModalOpen(playerType: string, propsNames: any[], item?: any) {
    const mode = 'single';
    const team = this.team;
    const teamName = this.teamName;
    if (playerType === 'team') {
      propsNames = _.cloneDeep(propsNames);
      propsNames[0].value = `${team}${propsNames[0].value}`;
      item = {};
      item[propsNames[0].value] = this.betPredictionData.bet_predictor[propsNames[0].value];
      item[`${propsNames[0].value}_min`] = this.betPredictionData.bet_predictor[`${propsNames[0].value}_min`];
      item[`${propsNames[0].value}_bad`] = this.betPredictionData.bet_predictor[`${propsNames[0].value}_bad`];
      item[`${propsNames[0].value}_good`] = this.betPredictionData.bet_predictor[`${propsNames[0].value}_good`];
      item[`${propsNames[0].value}_max`] = this.betPredictionData.bet_predictor[`${propsNames[0].value}_max`];
      item[`${propsNames[0].value}_conditional`] = this.betPredictionData.bet_predictor[`${propsNames[0].value}_conditional`];
    }
    const modalRef = this.modalService.open(InputPanelModalComponent, {
      size: 'lg',
      windowClass: `lineups-custom-modal input-panel-modal-${mode}`
    });
    modalRef.componentInstance.data = {
      league: 'mlb',
      selectedMatcupUrl: this.selectedMatcupUrl,
      predictiveModel: this.predictiveModelValue,
      mode,
      team,
      teamName,
      playerType,
      innerData: {
        propsNames,
        item
      }
    };
    modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${reason}`);
    });
  }

  showPitcher(item) {
    return item.played;
  }

  searchFunction(data, target, keyword) {
    const filteredList = data
      .filter(el => {
        if (!keyword) {
          return true;
        }
        const name = el.name.toLowerCase().split(' ');
        const searchWord = keyword.toLowerCase();
        for (let i = 0; i < name.length; i++) {
          if (name[i].indexOf(searchWord) === 0) {
            return true;
          }
        }
        return false;
      })
      .sort((a, b) => {
        return a.name.toLowerCase().indexOf(keyword.toLowerCase()) > b.name.toLowerCase().indexOf(keyword.toLowerCase()) ? 1 : -1;
      });
    return observableOf(filteredList);
  }

  showBatter(item) {
    return item.started;
  }

  disabledArrow(item) {
    if (item.rating >= item.rating_max) {
      return 'disabled-up';
    }
    if (item.rating <= item.rating_min) {
      return 'disabled-down';
    }
    return '';
  }
}
