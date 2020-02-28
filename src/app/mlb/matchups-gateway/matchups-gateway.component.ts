
import {throwError as observableThrowError,  Observable ,  Subscription } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatchupsGatewayService } from './matchups-gateway.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';
import { CommonService } from '../../shared/services/common.service';
import { Router } from '@angular/router';
import { BetPredictorService } from '../bet-predictor/bet-predictor.service';
import { ScoreBarHelperService } from '../../score-bar/score-bar-helper.service';

@Component({
  selector: 'app-matchups',
  templateUrl: './matchups-gateway.component.html',
  styleUrls: ['./matchups-gateway.component.scss']
})
export class MatchupsComponent implements OnInit, OnDestroy {
  realTimeSubscription: Subscription;
  matchups;
  showedIndividualMatchup = null;
  pageTitle: string;
  introParagraph: string;
  loading = true;
  updatedTime;

  constructor(
    private matchupsGatewayService: MatchupsGatewayService,
    private breadcrumbService: BreadcrumbService,
    private betPredictorService: BetPredictorService,
    private commonService: CommonService,
    private scoreBarService: ScoreBarHelperService,
    private router: Router,
    private title: TitleService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.matchupsGatewayService.getTodayMatchups().pipe(
      catchError((err) => {
        this.loading = false;
        return observableThrowError(err);
      }))
      .subscribe((response) => {
        this.loading = false;
        this.updatedTime = response.updated;
        this.pageTitle = response.heading;
        this.breadcrumbService.changeBreadcrumbs([
          {label: 'MLB', url: '/mlb'},
          {label: 'Teams', url: '/mlb/teams'},
          {label: this.pageTitle, url: '/mlb/matchups'},
        ]);
        if (response.page_title) {
          this.title.setTitle(response.page_title);
        } else {
          this.title.setTitle(this.pageTitle);
        }
        this.introParagraph = response.intro_paragraph;
        if (response.data && response.data.length > 0) {
          this.matchups = this.matchupsGatewayService.sortMatchups(response.data.map(matchup => {
            matchup.showed = true;
            return matchup;
          }));
          this.subscribeOnRealTimeUpdate();
          this.scoreBarService.fireMlbUpdate();
        }
      });
  }

  ngOnDestroy() {
    if (this.realTimeSubscription) {
      this.realTimeSubscription.unsubscribe();
    }
  }

  onToggleItem(event, matchup): void {
    event.stopPropagation();
    matchup.showed = !matchup.showed;
    const showedMatchups = this.matchups.filter(matchupItem => matchupItem.showed);
    if (showedMatchups.length === 1) {
      this.showedIndividualMatchup = showedMatchups[0].game_id;
    } else if (this.showedIndividualMatchup) {
      this.showedIndividualMatchup = null;
    }
  }

  showSelectNone() {
    const showedMatchups = this.matchups.filter(matchup => matchup.showed).length;
    return showedMatchups !== 0;
  }

  private subscribeOnRealTimeUpdate() {
    this.realTimeSubscription = this.scoreBarService.mlbScoreArrUpdated
      .subscribe((data) => {
        this.matchups = this.matchupsGatewayService.sortMatchups(this.matchups.map(matchup => {
          const matchupStatus = data[matchup.nav.game_id];
          if (matchupStatus) {
            matchup.status = matchupStatus;
          }
          return matchup;
        }));
      });
  }
}
