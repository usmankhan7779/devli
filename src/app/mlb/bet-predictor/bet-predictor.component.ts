
import {mergeMap} from 'rxjs/operators';
import { Component, Inject, Injector, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { BetPredictorService } from './bet-predictor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InputPanelService } from '../../shared/modals/input-panel-modal/input-panel.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { InputPanelModalComponent } from '../../shared/modals/input-panel-modal/input-panel-modal.component';
import { LineupsGatewayService } from '../lineups-gateway/lineups-gateway.service';
import { CommonService } from '../../shared/services/common.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { BetPredictorHelpButtonComponent } from '../../shared/modals/bet-predictor-help-button/bet-predictor-help-button.component';
import { ScoreBarHelperService } from '../../score-bar/score-bar-helper.service';

@Component({
  selector: 'app-bet-predictor',
  templateUrl: 'bet-predictor.component.html',
  styleUrls: ['./bet-predictor.component.scss']
})
export class BetPredictorComponent implements OnInit, OnDestroy {
  readonly defaultModel = 'basic';
  inIframe: boolean;
  pageNavOpen = false;
  currentTab: string;
  lineups;
  predictedBetsData;
  savedBetsData;
  selectedMatcupUrl;
  predictiveModels;
  tabs = {
    lineups: 'lineups',
    playerStats: 'playerStats',
    predictedBets: 'predictedBets',
    games: 'games',
    news: 'news',
    matchup: 'matchup',
    savedBets: 'savedBets'
  };
  orderedMatchups: any[] = [];
  activeDDs = {
    league: {
      label: 'MLB'
    },
    matchup: null,
    predictiveModel: null
  };
  betPredictionData: any;
  betChangesSubscription: Subscription;
  predictedBetsUpdatedSubscription: Subscription;
  predictedBetCardWasSavedSubscription: Subscription;
  predictedBetTabWasDeletedSubscription: Subscription;
  savedBetTabWasDeletedSubscription: Subscription;
  loginSubscription: Subscription;
  private modalService;

  dropdownCollapsed = false;

  constructor(
    private betPredictorService: BetPredictorService,
    private inputPanelService: InputPanelService,
    private lineupsGatewayService: LineupsGatewayService,
    private commonService: CommonService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private scoreBarService: ScoreBarHelperService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService = this.injector.get(NgbModal);
    }
    if (this.commonService.openedInIframe()) {
      this.inIframe = true;
    }
    this.scoreBarService.hideScorebar();
  }

  ngOnInit() {
    this.spinnerService.spinnerImg = 'dots';
    this.spinnerService.spinnerText = 'Updating';

    this.loginSubscription = this.authService.loginCallback.subscribe(() => {
      this.initActions();
    });
    this.predictedBetCardWasSavedSubscription = this.getPredictedBetCardWasSavedSubscription();
    this.predictedBetTabWasDeletedSubscription = this.getPredictedBetTabWasDeletedSubscription();
    this.savedBetTabWasDeletedSubscription = this.getSavedBetTabWasDeletedSubscription();
    this.betChangesSubscription = this.getBetChangesSubscription();
    this.predictedBetsUpdatedSubscription = this.getPredictedBetsUpdatedSubscription();

    this.initActions();
  }

  ngOnDestroy() {
    this.scoreBarService.showScorebar();
    this.betChangesSubscription.unsubscribe();
    this.predictedBetsUpdatedSubscription.unsubscribe();
    this.predictedBetCardWasSavedSubscription.unsubscribe();
    this.predictedBetTabWasDeletedSubscription.unsubscribe();
    this.savedBetTabWasDeletedSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }

  onTabClick(tabName: string) {
    if (tabName === this.tabs.games && !this.lineups) {
      this.getLineups()
        .subscribe(() => {
          this.currentTab = tabName;
        })
    } else {
      this.currentTab = tabName;
    }
  }

  selectMatchup(matchup: any) {
    if (matchup) {
      this.activeDDs.matchup = matchup;
      this.selectedMatcupUrl = matchup.game_id;
      this.betPredictorService.getPredictedBets(this.selectedMatcupUrl)
        .subscribe(res => {
          this.predictedBetsData = res;
          if (!this.predictiveModels) {
            this.predictiveModels = this.commonService.createArrayFromNamedObj(res.models, 'label', 'value');
          }
          this.onPredictiveModledSelect(_.find(this.predictiveModels, {
            value: this.activeDDs.predictiveModel && this.activeDDs.predictiveModel.value ?
              this.activeDDs.predictiveModel.value : this.defaultModel
          }));
        });
    }
  }

  onPredictiveModledSelect(model) {
    this.activeDDs.predictiveModel = model;
    this.betPredictorService.getSingleBetPrediction(this.activeDDs.matchup.game_id, model.value)
      .subscribe(betPrediction => {
        this.inputPanelService.setBetPrediction(betPrediction);
      });
  }

  onHelpBtnClick() {
     this.modalService.open(BetPredictorHelpButtonComponent, {size: 'lg', windowClass: `lineups-custom-modal common-modal` });
  }

  onHowItWorksClick() {

  }

  onResetBtnClick() {
    this.spinnerService.handleAPICall(
      this.betPredictorService.saveSingleBetPrediction(this.selectedMatcupUrl, {
        model_type: this.activeDDs.predictiveModel.value,
        reset: true
      })
    )
      .subscribe(res => {
        console.log('saveSingleBetPrediction', res);
        this.inputPanelService.setBetPrediction(res);
      });
  }

  onSaveBtnClick() {
    this.spinnerService.handleAPICall(this.betPredictorService.updatePredictedBets(this.selectedMatcupUrl, {
        model_type: this.activeDDs.predictiveModel.value
      })
    )
      .subscribe(res => {
        this.inputPanelService.updatePredictedBets(res);
        console.log('updatePredictedBets', res);
      });
  }

  onInputPanelClick() {
    const mode = 'multiple';
    const modalRef = this.modalService.open(InputPanelModalComponent, {
      size: 'lg',
      windowClass: `lineups-custom-modal input-panel-modal-${mode}`
    });
    modalRef.componentInstance.data = {
      league: 'mlb',
      selectedMatcupUrl: this.selectedMatcupUrl,
      predictiveModel: this.activeDDs.predictiveModel.value,
      mode,
      betPredictionData: this.betPredictionData
    };
    modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${reason}`);
    });
  }

  private getLineups() {
    return this.lineupsGatewayService.mlbStartingLineups().pipe(
      mergeMap(lineups => {
        this.lineups = this.lineupsGatewayService.sortLineups(lineups.data);
        return this.lineups;
      }));
  }

  private getPredictedBetCardWasSavedSubscription() {
    return this.betPredictorService.predictedBetCardWasSaved
      .subscribe((card: {cardId: number, isSaved: boolean}) => {
        this.getSavedBets();
        const predictedBetsData = _.cloneDeep(this.predictedBetsData);
        for (let i = 0; i < predictedBetsData.tabs.length ; i++) {
          for (let j = 0; j < predictedBetsData.tabs[i].cards.length ; j++) {
            for (let k = 0; k < predictedBetsData.tabs[i].cards[j].predicted_bets.length ; k++) {
              const bet = predictedBetsData.tabs[i].cards[j].predicted_bets[k];
              if (bet.id === card.cardId) {
                bet.saved = card.isSaved;
              }
            }
          }
        }
        this.predictedBetsData = predictedBetsData;
      });
  }

  private getBetChangesSubscription() {
    return this.inputPanelService.betPredictionChanged
      .subscribe((betPrediction) => {
        if (betPrediction.error && this.betPredictionData) {
          this.commonService.showNotification(betPrediction.error_text);
        } else {
          this.betPredictionData = betPrediction;
          console.log('DEBUG_TEXT ==>', this.betPredictionData.debug_text);
          if (this.betPredictionData && this.betPredictionData.stale) {
            this.commonService.showNotification(this.betPredictionData.stale, 'Data Updated', 'OK');
          }
        }
      });
  }

  private getPredictedBetTabWasDeletedSubscription() {
    return this.betPredictorService.predictedBetTabWasDeleted
      .subscribe(({tabId}) => {
        const predictedBetsData = _.cloneDeep(this.predictedBetsData);
        predictedBetsData.tabs.splice(_.findIndex(predictedBetsData.tabs, {id: tabId}), 1);
        this.predictedBetsData = predictedBetsData;
      });
  }

  private getSavedBetTabWasDeletedSubscription() {
    return this.betPredictorService.savedBetTabWasDeleted
      .subscribe(({tabId}) => {
        const savedBetsData = _.cloneDeep(this.savedBetsData);
        savedBetsData.tabs.splice(_.findIndex(savedBetsData.tabs, {id: tabId}), 1);
        this.savedBetsData = savedBetsData;
      });
  }

  private getPredictedBetsUpdatedSubscription() {
    return this.inputPanelService.predictedBetsUpdated
      .subscribe((predictedBetsData: any) => {
        this.predictedBetsData = predictedBetsData;
        this.onTabClick(this.tabs.predictedBets);
      });
  }

  private getSavedBets() {
    if (isPlatformBrowser(this.platformId)) {
      this.betPredictorService.getSavedBets()
      .subscribe(res => {
        this.savedBetsData = res;
      });
    }
  }

  private initActions() {
    this.currentTab = this.tabs.lineups;
    this.getSavedBets();
    this.betPredictorService.getBetPredictorMatchups()
      .subscribe(matchups => {
        this.orderedMatchups = this.orderGames(matchups);
        const preselectedGameId = this.betPredictorService.getPreSelectedGameId();
        const preselectedMatchup = (preselectedGameId ? _.find(this.orderedMatchups, {game_id: preselectedGameId as any}) : false);
        this.selectMatchup(preselectedMatchup || this.orderedMatchups[0]);
      });
  }

  private orderGames(games) {
    const finalGames = games.filter(game => game.status.status === 'Final')
      .sort(this.sortByDateTime);
    const inProgressGames = games.filter(game => game.status.status === 'In Progress')
      .sort(this.sortByDateTime);
    const otherGames = games.filter(game => game.status.status !== 'In Progress' && game.status.status !== 'Final')
      .sort(this.sortByDateTime);
    return [...otherGames, ...inProgressGames, ...finalGames];
  }

  private sortByDateTime(a, b) {
    if (a.nav.matchup_time < b.nav.matchup_time) {
      return -1;
    }
    if (a.nav.matchup_time > b.nav.matchup_time) {
      return 1;
    }
    return 0;
  }
}
