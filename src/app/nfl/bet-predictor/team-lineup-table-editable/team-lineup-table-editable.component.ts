
import {of as observableOf,  Observable } from 'rxjs';
import { Component, HostListener, Inject, Injector, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InputPanelModalComponent } from '../../../shared/modals/input-panel-modal/input-panel-modal.component';
import { PlayerNewsModalComponent } from '../../../shared/modals/player-news-modal/player-news-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import { InputPanelService } from '../../../shared/modals/input-panel-modal/input-panel.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { DataTable } from '@pascalhonegger/ng-datatable';
import { NflBetPredictorService } from '../bet-predictor.service';
import { isPlatformBrowser } from '@angular/common';
import { NflService } from '../../nfl.service';
import { TimeZoneService } from '../../../shared/services/time-zone.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-team-lineup-table-editable',
  templateUrl: './team-lineup-table-editable.component.html',
  styleUrls: ['./team-lineup-table-editable.component.scss'],
  providers: [DataTable]
})
export class TeamLineupTableEditableComponent implements OnInit {
  @Input() teamName: string;
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
  @Input() team: string; // home | away
  @Input() betPredictionData: any;
  @Input() private matchup: any;
  @Input() predictiveModelValue: string;
  @Input() selectedMatcupUrl: string;

  _quarterbacks: any;
  @Input() set quarterbacks(quarterbacks) {
    if (quarterbacks && quarterbacks.length > 1) {
      this._quarterbacks = quarterbacks.sort(this.orderFn);
    } else {
      this._quarterbacks = quarterbacks;
    }
  };
  get quarterbacks() {
    return this._quarterbacks;
  }

  _runningbacks: any;
  @Input() set runningbacks(runningbacks) {
    if (runningbacks && runningbacks.length > 1) {
      this._runningbacks = runningbacks.sort(this.orderFn);
    } else {
      this._runningbacks = runningbacks;
    }
  };
  get runningbacks() {
    return this._runningbacks;
  }

  _tightEnds: any;
  @Input() set tightEnds(tightEnds) {
    if (tightEnds && tightEnds.length > 1) {
      this._tightEnds = tightEnds.sort(this.orderFn);
    } else {
      this._tightEnds = tightEnds;
    }
  };
  get tightEnds() {
    return this._tightEnds;
  }

  _teamDefense: any;
  @Input() set teamDefense(teamDefense) {
    if (teamDefense && teamDefense.length > 1) {
      this._teamDefense = teamDefense.sort(this.orderFn);
    } else {
      this._teamDefense = teamDefense;
    }
  };
  get teamDefense() {
    return this._teamDefense;
  }

  _kickers: any;
  @Input() set kickers(kickers) {
    if (kickers && kickers.length > 1) {
      this._kickers = kickers.sort(this.orderFn);
    } else {
      this._kickers = kickers;
    }
  };
  get kickers() {
    return this._kickers;
  }

  _wideReceivers: any;
  @Input() set wideReceivers(wideReceivers) {
    if (wideReceivers && wideReceivers.length > 1) {
      this._wideReceivers = wideReceivers.sort(this.orderFn);
    } else {
      this._wideReceivers = wideReceivers;
    }
  };
  get wideReceivers() {
    return this._wideReceivers;
  }

  quarterbackProps: {name: string, value: string}[];
  runningbackProps: {name: string, value: string}[];
  tightEndProps: {name: string, value: string}[];
  teamDefenseProps: {name: string, value: string}[];
  kickerProps: {name: string, value: string}[];
  wideReceiverProps: {name: string, value: string}[];
  teamProps: {name: string, value: string}[];

  onQuarterbackModalOpen = this.onPlayerModalOpen.bind(this, 'qb');
  onRunningbackModalOpen = this.onPlayerModalOpen.bind(this, 'rb');
  onTightendModalOpen = this.onPlayerModalOpen.bind(this, 'te');
  onTeamDefenseModalOpen = this.onPlayerModalOpen.bind(this, 'def');
  onKickerModalOpen = this.onPlayerModalOpen.bind(this, 'k');
  onWideReceiverModalOpen = this.onPlayerModalOpen.bind(this, 'wr');
  onTeamModalOpen = this.onPlayerModalOpen.bind(this, 'team');
  windowWidth = this.getWindowWidth();
  private modalService;

  timeZone = this.timeZoneService.getTimeZoneAbbr();

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.windowWidth = event.target.innerWidth;
  }

  constructor(
    private nflService: NflService,
    private betPredictorService: NflBetPredictorService,
    private inputPanelService: InputPanelService,
    private spinnerService: SpinnerService,
    private commonService: CommonService,
    private timeZoneService: TimeZoneService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService = this.injector.get(NgbModal);
    }
  }

  ngOnInit() {
    this.quarterbackProps = this.betPredictorService.quarterbackProps;
    this.runningbackProps = this.betPredictorService.runningbackProps;
    this.tightEndProps = this.betPredictorService.tightEndProps;
    this.teamDefenseProps = this.betPredictorService.teamDefenseProps;
    this.kickerProps = this.betPredictorService.kickerProps;
    this.wideReceiverProps = this.betPredictorService.wideReceiverProps;
    this.teamProps = this.betPredictorService.teamProps;
  }

  private orderFn(a, b) {
    return a.depth - b.depth;
  }

  onArrowClick(item, isUp) {
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
        rating: item.rating
      }
    };
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
      'original': event['original'].depth || null,
      'new': event['new_player'].depth || null,
      'replacement': event['new_player'].player_id
    };
    data.replacements[event['new_player'].player_id] = {
      'original': event['new_player'].depth || null,
      'new': event['original'].depth || null,
      'replacement': event['original'].player_id
    };
    this.spinnerService.handleAPICall(this.betPredictorService.saveSingleBetPrediction(this.matchup.game_key, data))
      .subscribe(res => {
        this.inputPanelService.setBetPrediction(res);
        console.log('onSwap RES', res);
      })
  }

  tightEndDDFormatter(item: any) {
    const ratingClass = this.commonService.setRatingClass(item.rating);
    return `
    <table class="w-100" style="table-layout: fixed">
      <tbody>
        <tr class="text-center">
          <td width="7%">
            <button class="btn team-swap-btn">${item.position}</button>
          </td>
          <td width="30%" class="text-left">
            ${item.name}
          </td>
          <td>
            <div class="rating-formatter ${ratingClass}">${item.rating}</div>
          </td>
          <td>${item.depth}</td>
          <td>${item.snaps}</td>
          <td>${item.receiving_targets}</td>
          <td>${item.receptions}</td>
          <td>${item.receiving_yards}</td>
          <td>${item.receiving_touchdowns}</td>
          <td>${item.fumbles}</td>
        </tr>
      </tbody>
    </table>
    `;
  }

  wideReceiverDDFormatter(item: any) {
    const ratingClass = this.commonService.setRatingClass(item.rating);
    return `
    <table class="w-100" style="table-layout: fixed">
      <tbody>
        <tr class="text-center">
          <td width="7%">
            <button class="btn team-swap-btn">${item.position}</button>
          </td>
          <td width="30%" class="text-left">
            ${item.name}
          </td>
          <td>
            <div class="rating-formatter ${ratingClass}">${item.rating}</div>
          </td>
          <td>${item.depth}</td>
          <td>${item.snaps}</td>
          <td>${item.receiving_targets}</td>
          <td>${item.receptions}</td>
          <td>${item.receiving_yards}</td>
          <td>${item.receiving_touchdowns}</td>
          <td>${item.fumbles}</td>
        </tr>
      </tbody>
    </table>
    `;
  }

  runningbackDDFormatter(item: any) {
    const ratingClass = this.commonService.setRatingClass(item.rating);
    return `
    <table class="w-100" style="table-layout: fixed">
      <tbody>
        <tr class="text-center">
          <td width="7%">
            <button class="btn team-swap-btn">${item.position}</button>
          </td>
          <td width="30%" class="text-left">
            ${item.name}
          </td>
          <td>
            <div class="rating-formatter ${ratingClass}">${item.rating}</div>
          </td>
          <td>${item.depth}</td>
          <td>${item.snaps}</td>
          <td>${item.rushing_attempts}</td>
          <td>${item.rushing_yards}</td>
          <td>${item.rushing_touchdowns}</td>
          <td>${item.receiving_targets}</td>
          <td>${item.receptions}</td>
          <td>${item.receiving_yards}</td>
          <td>${item.receiving_touchdowns}</td>
          <td>${item.fumbles}</td>
        </tr>
      </tbody>
    </table>
    `;
  }

  quarterbackDDFormatter(item: any) {
    const ratingClass = this.commonService.setRatingClass(item.rating);
    return `
    <table class="w-100" style="table-layout: fixed">
      <tbody>
        <tr class="text-center">
          <td width="7%">
            <button class="btn team-swap-btn">${item.position}</button>
          </td>
          <td width="30%" class="text-left">
            ${item.name}
          </td>
          <td>
            <div class="rating-formatter ${ratingClass}">${item.rating}</div>
          </td>
          <td>${item.snaps}</td>
          <td>${item.passing_completions}</td>
          <td>${item.passing_attempts}</td>
          <td>${item.passing_yards}</td>
          <td>${item.passing_touchdowns}</td>
          <td>${item.passing_interceptions}</td>
          <td>${item.possession_time}</td>
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
      league: 'nfl',
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
      homeName: `${this.matchup.game_info.home_team_key} vs ${this.matchup.game_info.away_team_key}`,
      awayName: `${this.matchup.game_info.away_team_key} @ ${this.matchup.game_info.home_team_key}`,
      homeLogo: 'assets/images/nfl/logos/bordered/' + this.matchup.home_route + '-largest.svg',
      awayLogo: 'assets/images/nfl/logos/bordered/' + this.matchup.away_route + '-largest.svg',
      time: moment(this.matchup.game_info.game_time_dt).format('h:mm a').toLowerCase() + ' ' +
      this.timeZone + ', ' + moment(this.matchup.game_info.game_time_dt).format('M/D')
    };
    let players = _.concat(
      this.betPredictionData.away.qb.map(player => {player.is_home = false; player.type = 'QB'; return player}),
      this.betPredictionData.away.rb.map(player => {player.is_home = false; player.type = 'RB'; return player}),
      this.betPredictionData.away.wr.map(player => {player.is_home = false; player.type = 'WR'; return player}),
      this.betPredictionData.away.te.map(player => {player.is_home = false; player.type = 'TE'; return player}),
      this.betPredictionData.away.def.map(player => {player.is_home = false; player.type = 'TD'; return player}),
      this.betPredictionData.away.k.map(player => {player.is_home = false; player.type = 'K'; return player}),
      this.betPredictionData.home.qb.map(player => {player.is_home = true; player.type = 'QB'; return player}),
      this.betPredictionData.home.rb.map(player => {player.is_home = true; player.type = 'RB'; return player}),
      this.betPredictionData.home.wr.map(player => {player.is_home = true; player.type = 'WR'; return player}),
      this.betPredictionData.home.te.map(player => {player.is_home = true; player.type = 'TE'; return player}),
      this.betPredictionData.home.def.map(player => {player.is_home = true; player.type = 'TD'; return player}),
      this.betPredictionData.home.k.map(player => {player.is_home = true; player.type = 'K'; return player}),
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
      league: 'nfl',
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
    if (playerType === 'te' || playerType === 'wr' || playerType === 'rb') {
      propsNames = _.cloneDeep(propsNames);
      const depthIndex = _.findIndex(propsNames, {value: 'depth' as any});
      if (depthIndex !== -1) {
        propsNames[depthIndex].max = this.betPredictionData.depths[team][playerType];
      }
    }
    const modalRef = this.modalService.open(InputPanelModalComponent, {
      size: 'lg',
      windowClass: `lineups-custom-modal input-panel-modal-${mode}`
    });
    modalRef.componentInstance.data = {
      league: 'nfl',
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

  showPlayer(item) {
    return item.started;
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

  disabledArrow(item) {
    if (item.rating >= item.rating_max) {
      return 'disabled-up';
    }
    if (item.rating <= item.rating_min) {
      return 'disabled-down';
    }
    return '';
  }

  getEmptyRows(tableType) {
    if (this.windowWidth >= 1200) {
      let oppTeam;
      if (this.team === 'home') {
        oppTeam = 'away';
      } else {
        oppTeam = 'home';
      }
      const teamPlayersLength = this.betPredictionData[this.team][tableType].filter(player => player.started).length;
      const oppPlayersLength = this.betPredictionData[oppTeam][tableType].filter(player => player.started).length;
      if (teamPlayersLength === oppPlayersLength || teamPlayersLength > oppPlayersLength) {
        return 0;
      }
      return oppPlayersLength - teamPlayersLength;
    }
    return 0
  }

  private getWindowWidth() {
    if (isPlatformBrowser(this.platformId)) {
      return this.windowWidth = window.innerWidth;
    }
    return 0;
  }
}
