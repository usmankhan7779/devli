
import {throwError as observableThrowError,  Observable ,  Subscription } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LineupsGatewayService } from './lineups-gateway.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';
import { CommonService } from '../../shared/services/common.service';
import { ScoreBarHelperService } from '../../score-bar/score-bar-helper.service';
import { Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-lineups-gateway',
  templateUrl: './lineups-gateway.component.html',
  styleUrls: ['./lineups-gateway.component.scss']
})
export class LineupsGatewayComponent implements OnInit, OnDestroy {
  realTimeSubscription: Subscription;
  scoreBarReadySubscription: Subscription;

  lineups: any;
  lineupsRoutes: any;
  loading = true;
  twitterInit = false;
  pageTitle: string;
  introParagraph: string;
  bottomParagraph: string;
  bottomHeading: string;
  // Action Header Menu Button States
  // --------------------------------
  // Button Group 1
  updatedTime;
  sportActionActive = true;
  bettingActionActive = false;
  fantasyActionActive = false;
  // Button Group 2
  draftKingsActionActive = true;
  fanDuelActionActive = false;
  yahooActionActive = false;
  // Button Group 3
  averageActionActive = false;
  basePredictionActionActive = false;
  mlConsensusActionActive = false;
  linearRegressionActionActive = false;
  boostedRegressorActionActive = true;
  randomForestActionActive = false;
  naiveBayesActionActive = false;


  constructor(
    private breadcrumbService: BreadcrumbService,
    private lineupsGatewayService: LineupsGatewayService,
    private scoreBarService: ScoreBarHelperService,
    private commonService: CommonService,
    private title: TitleService,
    private meta: Meta
  ) { }


  ngOnInit() {
    this.twitterInit = false;
    this.loading = true;
    // Initialize Page with Data
    this.lineupsGatewayService.mlbStartingLineups().pipe(
      catchError(err => {
        this.loading = false;
        return observableThrowError(err);
      }))
      .subscribe(response => {
        this.updatedTime = response.updated;
        this.pageTitle = response.heading;
        this.introParagraph = response.intro_paragraph;
        this.bottomParagraph = response.bottom_paragraph;
        this.bottomHeading = response.bottom_header;
        if (response.meta) {
          this.meta.removeTag('name="description"');
          this.meta.addTag({ name: 'description', content: response.meta });
        }
        this.breadcrumbService.changeBreadcrumbs([
          {label: 'MLB', url: '/mlb'},
          {label: 'Teams', url: '/mlb/teams'},
          {label: this.pageTitle, url: `/mlb/lineups`}
        ]);
        if (response.page_title) {
          this.title.setTitle(response.page_title);
        }
        if (!response.data || !response.data.length) {
          this.lineups = [];
          this.lineupsGatewayService.mlbStartingLineupsRoutes()
            .subscribe(res => {
              this.lineupsRoutes = this.commonService.createArrayFromNamedObj(res.lineups_routes);
              this.loading = false;
            })
        } else {
          this.lineups = this.lineupsGatewayService.sortLineups(response.data);
          if (this.commonService.isBrowser()) {
            this.subscribeOnRealTimeUpdateHandler();
          }
          console.log(this.lineups);
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    if (this.realTimeSubscription) {
      this.realTimeSubscription.unsubscribe();
    }
    if (this.scoreBarReadySubscription) {
      this.scoreBarReadySubscription.unsubscribe();
    }
    this.meta.removeTag('name="description"');
  }

  // Action Header Menu Button Click Listeners
  // -----------------------------------------
  // Button Group 1 Actions
  onSportAction() {
    this.sportActionActive = true;
    this.bettingActionActive = false;
    this.fantasyActionActive = false;
  }

  onBettingAction() {
    this.bettingActionActive = true;
    this.sportActionActive = false;
    this.fantasyActionActive = false;
  }

  onFantasyAction() {
    this.fantasyActionActive = true;
    this.sportActionActive = false;
    this.bettingActionActive = false;
  }
  // Button Group 2 Actions
  onDraftKingsAction() {
    this.draftKingsActionActive = true;
    this.fanDuelActionActive = false;
    this.yahooActionActive = false;
  }

  onFanDuelAction() {
    this.fanDuelActionActive = true;
    this.draftKingsActionActive = false;
    this.yahooActionActive = false;
  }

  onYahooAction() {
    this.yahooActionActive = true;
    this.draftKingsActionActive = false;
    this.fanDuelActionActive = false;
  }
  // Button Group 3 Actions
  onAverageAction() {
    this.averageActionActive = true;
    this.basePredictionActionActive = false;
    this.mlConsensusActionActive = false;
    this.linearRegressionActionActive = false;
    this.boostedRegressorActionActive = false;
    this.randomForestActionActive = false;
    this.naiveBayesActionActive = false;
  }

  onBasePredictionAction() {
    this.basePredictionActionActive = true;
    this.averageActionActive = false;
    this.mlConsensusActionActive = false;
    this.linearRegressionActionActive = false;
    this.boostedRegressorActionActive = false;
    this.randomForestActionActive = false;
    this.naiveBayesActionActive = false;
  }

  onMlConsensusAction() {
    this.mlConsensusActionActive = true;
    this.averageActionActive = false;
    this.basePredictionActionActive = false;
    this.linearRegressionActionActive = false;
    this.boostedRegressorActionActive = false;
    this.randomForestActionActive = false;
    this.naiveBayesActionActive = false;
  }

  onLinearRegressionAction() {
    this.linearRegressionActionActive = true;
    this.averageActionActive = false;
    this.basePredictionActionActive = false;
    this.mlConsensusActionActive = false;
    this.boostedRegressorActionActive = false;
    this.randomForestActionActive = false;
    this.naiveBayesActionActive = false;
  }

  onBoostedRegressorAction() {
    this.boostedRegressorActionActive = true;
    this.averageActionActive = false;
    this.basePredictionActionActive = false;
    this.mlConsensusActionActive = false;
    this.linearRegressionActionActive = false;
    this.randomForestActionActive = false;
    this.naiveBayesActionActive = false;
  }

  onRandomForestAction() {
    this.randomForestActionActive = true;
    this.averageActionActive = false;
    this.basePredictionActionActive = false;
    this.mlConsensusActionActive = false;
    this.linearRegressionActionActive = false;
    this.boostedRegressorActionActive = false;
    this.naiveBayesActionActive = false;
  }

  onNaiveBayesAction() {
    this.naiveBayesActionActive = true;
    this.averageActionActive = false;
    this.basePredictionActionActive = false;
    this.mlConsensusActionActive = false;
    this.linearRegressionActionActive = false;
    this.boostedRegressorActionActive = false;
    this.randomForestActionActive = false;
  }

  // Private

  private subscribeOnRealTimeUpdateHandler() {
    if (this.scoreBarService.scoreBarReady) {
      this.subscribeOnRealTimeUpdate();
    } else if (!this.realTimeSubscription && !this.scoreBarReadySubscription) {
      this.scoreBarReadySubscription = this.scoreBarService.scoreBarReadyEvent.subscribe(() => {
        this.subscribeOnRealTimeUpdate();
      })
    }
  }

  private subscribeOnRealTimeUpdate() {
    this.realTimeSubscription = this.scoreBarService.mlbScoreArrUpdated
      .subscribe((data) => {
        if (this.lineups && this.lineups.length > 0) {
          this.lineups = this.lineupsGatewayService.sortLineups(this.lineups.map(lineup => {
            const matchupStatus = data[lineup.game_id];
            if (matchupStatus) {
              lineup.data.status = matchupStatus;
            }
            return lineup;
          }));
        }
      });
    this.scoreBarService.fireMlbUpdate();
  }
}
