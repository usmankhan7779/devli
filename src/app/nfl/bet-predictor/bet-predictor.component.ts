
import {forkJoin as observableForkJoin, of as observableOf,  Subscription ,  Observable } from 'rxjs';
import { Component, Inject, Injector, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { isPlatformBrowser } from '@angular/common';
import { InputPanelModalComponent } from '../../shared/modals/input-panel-modal/input-panel-modal.component';
import { AuthService } from '../../auth/auth.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InputPanelService } from '../../shared/modals/input-panel-modal/input-panel.service';
import { NflBetPredictorService } from './bet-predictor.service';
import * as _ from 'lodash';
import { NflService } from '../nfl.service';
import { VideoModalComponent } from '../../shared/modals/video-modal/video-modal.component';
import { BetPredictorHelpButtonComponent } from '../../shared/modals/bet-predictor-help-button/bet-predictor-help-button.component';
import { ScoreBarHelperService } from '../../score-bar/score-bar-helper.service';


@Component({
  selector: 'app-bet-predictor',
  templateUrl: './bet-predictor.component.html',
  styleUrls: ['./bet-predictor.component.scss']
})
export class BetPredictorComponent implements OnInit, OnDestroy {
  private LOADING_TEXT = 'Loading...';
  private LOADING_IMG = 'circle';
  inIframe: boolean;
  pageNavOpen = false;
  currentTab: string;
  predictedBetsData;
  savedBetsData;
  selectedMatcupId;
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
  matchups = [];
  orderedMatchups = [];
  activeDDs = {
    league: {
      label: 'NFL'
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
    private betPredictorService: NflBetPredictorService,
    private inputPanelService: InputPanelService,
    private commonService: CommonService,
    private nflService: NflService,
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
    this.currentTab = tabName;
  }

  selectMatchup(matchup: any) {
    if (matchup && matchup.game_key) {
      this.activeDDs.matchup = matchup;
      this.selectedMatcupId = matchup.game_key;
      let getPredictedBetsCall: Observable<any>;
      if (isPlatformBrowser(this.platformId)) {
        getPredictedBetsCall = this.betPredictorService.getPredictedBets(this.selectedMatcupId);
      } else {
        getPredictedBetsCall = observableOf(null);
      }
      this.activeDDs.predictiveModel = _.find(this.predictiveModels, {
        value: this.activeDDs.predictiveModel && this.activeDDs.predictiveModel.value ? this.activeDDs.predictiveModel.value : 'rfc'
      });
      const getSingleBetPredictionCall = this.betPredictorService.getSingleBetPrediction(
        this.activeDDs.matchup.game_key,
        this.activeDDs.predictiveModel.value
      );

      this.spinnerService.handleAPICall(
        observableForkJoin([getPredictedBetsCall, getSingleBetPredictionCall]),
        this.LOADING_IMG,
        this.LOADING_TEXT
      ).subscribe(([predictedBetsData, betPrediction]) => {
        this.predictedBetsData = predictedBetsData;
        this.inputPanelService.setBetPrediction(betPrediction);
      })
    }
  }

  onPredictiveModelSelect(model) {
    this.activeDDs.predictiveModel = model;
    const getSingleBetPredictionCall = this.betPredictorService.getSingleBetPrediction(this.activeDDs.matchup.game_key, model.value);
    this.spinnerService.handleAPICall(getSingleBetPredictionCall, this.LOADING_IMG, this.LOADING_TEXT)
      .subscribe(betPrediction => {
        this.inputPanelService.setBetPrediction(betPrediction);
      });
  }

  onHelpBtnClick() {
    this.modalService.open(BetPredictorHelpButtonComponent, {size: 'lg', windowClass: `lineups-custom-modal common-modal` });
  }

  onHowItWorksClick() {
    const modalRef = this.modalService.open(VideoModalComponent, {
      size: 'lg',
      windowClass: `lineups-custom-modal common-modal video-modal`
    });
    modalRef.componentInstance.src = 'https://www.youtube.com/embed/dFY8CypTRHI?rel=0';
  }

  onResetBtnClick() {
    this.spinnerService.handleAPICall(
      this.betPredictorService.saveSingleBetPrediction(this.selectedMatcupId, {
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
    this.spinnerService.handleAPICall(this.betPredictorService.updatePredictedBets(this.selectedMatcupId, {
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
      league: 'nfl',
      selectedMatcupUrl: this.selectedMatcupId,
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
      this.spinnerService.handleAPICall(
        observableForkJoin([this.betPredictorService.getGames(), this.nflService.getNflModels()]),
        this.LOADING_IMG,
        this.LOADING_TEXT
      ).subscribe(([depthCharts, models]) => {
        this.getSavedBets();
        const resModels = {};
        // resModels['KNN'] = models['KNN'];
        // resModels['Logistic Regression'] = models['Logistic Regression'];
        resModels['Random Forest'] = models['Random Forest'];
        this.predictiveModels = this.commonService.createArrayFromNamedObj(resModels, 'label', 'value');
        if (depthCharts && depthCharts.depth_charts) {
          this.matchups = depthCharts.depth_charts;
          this.orderedMatchups = this.orderGames(depthCharts.depth_charts);
          this.selectMatchup(this.orderedMatchups[0]);
        }
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
    if (a.game_info.game_time_dt < b.game_info.game_time_dt) {
      return -1;
    }
    if (a.game_info.game_time_dt > b.game_info.game_time_dt) {
      return 1;
    }
    return 0;
  }
}
