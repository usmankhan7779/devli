
import { forkJoin as observableForkJoin } from 'rxjs';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { InGamePredictorService } from './in-game-predictor.service';
import { NflService } from '../nfl.service';
import { CommonService } from '../../shared/services/common.service';
import { isPlatformBrowser } from '@angular/common';
import * as _ from 'lodash';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { DepthChartService } from '../depth-charts/depth-chart.service';

@Component({
  selector: 'app-in-game-predictor',
  templateUrl: './in-game-predictor.component.html',
  styleUrls: ['./in-game-predictor.component.scss']
})
export class InGamePredictorComponent implements OnInit {
  liveSubscription: any;
  betDDsData: any;
  betsToShow: any;
  pageNavOpen: boolean;
  allGames: any[];
  allModels: any[];
  selectedGame;
  selectedModel;
  availableTabs = [
    'Live Game',
    'Pregame',
    'Bets',
    'Box Score'
  ];
  data;
  filterBetCategories;

  activeTab = this.availableTabs[0];

  constructor(
    private commonService: CommonService,
    private inGamePredictorService: InGamePredictorService,
    private depthChartService: DepthChartService,
    private nflService: NflService,
    private spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      observableForkJoin([this.depthChartService.getDepthCharts(), this.nflService.getNflModels()])
        .subscribe(([gamesRes, modelsRes]) => {
          this.allGames = gamesRes.depth_charts.slice().sort((game) => {
            if (game && game.status && game.status.status === 'In Progress') {
              return -1;
            } else if (game.status && game.status.status === 'Final') {
              return 1;
            }
            return 1;
          }).sort((game) => {
            if (game && game.status && game.status.status === 'In Progress') {
              return -1;
            } else if (game.status && game.status.status === 'Final') {
              return 1;
            }
            return 0;
          });
          this.allModels = this.commonService.createArrayFromNamedObj(modelsRes, 'label',  'value');
          this.selectGame(this.allGames[0], this.allModels[0]);
        });
    }
  }

  onTabClick(tab: string) {
    this.activeTab = tab;
  }

  selectGame(game, model) {
    if (this.liveSubscription) {
      this.liveSubscription.complete();
    }
    this.selectedGame = game;
    this.selectedModel = model;
    this.liveSubscription = this.inGamePredictorService.getGameData(this.selectedGame.game_key, model.value);
    this.liveSubscription.subscribe(response => {
      if (Number(response.current.quarter) === 1) {
        response.dropdowns.books = [{name: 'Bovada'}];
      } else {
        response.dropdowns.books = this.commonService.prepareDDItems(response.dropdowns.books, true, false);
      }
      const bovadaIndex = _.findIndex(response.dropdowns.books, {name: 'Bovada'});
      if (bovadaIndex !== -1) {
        response.dropdowns.books[bovadaIndex].selected = true;
      }
      response.dropdowns.dollar_ranges = this.commonService.prepareDDItems(response.dropdowns.dollar_ranges);
      response.dropdowns.ev_ranges = this.commonService.prepareDDItems(response.dropdowns.ev_ranges, false);
      response.dropdowns.models = this.commonService.prepareDDItems(response.dropdowns.models, false);
      response.dropdowns.probabilities = this.commonService.prepareDDItems(response.dropdowns.probabilities, false);
      response.dropdowns.bet_types = this.commonService.prepareDDItems(response.dropdowns.bet_types, false);
      response.dropdowns.bet_categories = this.commonService.prepareDDItems(response.dropdowns.bet_categories, false);
      this.betDDsData = _.cloneDeep(response.dropdowns);
      this.filterBetCategories = this.commonService.filterBySimpleProp
        .bind(this, this.betDDsData.bet_categories, 'id', 'bet_category');
      response.bets = this.inGamePredictorService.prepareBettingCards(response.bets.slice());
      this.data = response;
      this.filterBets();
    });
  }

  filterBets() {
    const dataToFilter: any = this.data.bets.map(a => ({...a})); // clone array of objects
    const filtered = [];
    dataToFilter.forEach((item) => {
      if (this.filterBook(item) && this.filterBetCategories(item)) {
          filtered.push(item);
      }
    });
    this.betsToShow = filtered;
  }

  private filterBook(card) {
    const activeBooks: any = _.filter(this.betDDsData.books, {selected: true});
    for (let i = 0; i < activeBooks.length; i++) {
      const bookValue = activeBooks[i].name;
      for (let j = 0; j < card.predicted_bets.length; j++) {
        if (card.predicted_bets[j].book === bookValue) {
          return true;
        }
      }
    }
    return false;
  }

}
