
import {throwError as observableThrowError, Subscription } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as _ from 'lodash';

// Services
import { ScoreBarService} from './score-bar.service';

// Interfaces
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';

import { TimeZoneService } from '../shared/services/time-zone.service';
import { NbaService } from '../nba/nba.service';
import { MatchupsGatewayService } from '../mlb/matchups-gateway/matchups-gateway.service';
import { NbaMatchupsService } from '../nba/matchups-gateway/matchups.service';
import { MatchupsService } from '../nfl/matchups-gateway/matchups.service';
import { CommonService } from '../shared/services/common.service';
import { ScoreBarHelperService } from './score-bar-helper.service';

@Component({
  selector: 'app-score-bar',
  templateUrl: './score-bar.component.html',
  styleUrls: ['./score-bar.component.scss']
})
export class ScoreBarComponent implements OnInit, OnDestroy, AfterViewInit {
  scoreBarReadySubscription: Subscription;

  isBrowser: boolean;
  dataLoaded: boolean;
  preSelectedOption: any;
  hideScorebar;
  leagueOpts: any[] = [
    {
      id: 0,
      label: 'MLB',
      propName: 'mlbSoreItems'
    },
    {
      id: 1,
      label: 'NFL',
      propName: 'nflSoreItems'
    },
    {
      id: 2,
      label: 'NBA',
      propName: 'nbaSoreItems'
    }
  ];
  leagueActiveOpt: any;

  showedScoreItems: any;
  nflSoreItems: any;
  mlbSoreItems: any;
  mlbSubscriptions = {
    subscriptions: {},
    soreItemsIds: []
  };
  nbaSubscriptions = {
    subscriptions: {},
    soreItemsIds: []
  };
  nbaSoreItems: any;
  subscriptions: Subscription[];

  timezoneName = this.timeZoneService.getTimeZoneAbbr();

  @ViewChild(SwiperDirective, {static: false}) swiperView: SwiperDirective;

  nflInterval;

  public config: SwiperConfigInterface = {
    initialSlide: 0,
    direction: 'horizontal',
    observer: false,
    scrollbar: false,
    keyboard: true,
    mousewheel: true,
    navigation: true,
    pagination: false,
    slideNextClass: '.swiper-button-next',
    slidePrevClass: '.swiper-button-prev'
  };

  constructor(
    private mlbMatchupsGatewayService: MatchupsGatewayService,
    private nbaMatchupsGatewayService: NbaMatchupsService,
    private nflMatchupsGatewayService: MatchupsService,
    private timeZoneService: TimeZoneService,
    private commonService: CommonService,
    private scorebarService: ScoreBarService,
    private scoreBarHelperService: ScoreBarHelperService,
    private nbaService: NbaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Set Initial Scoreboard Active Leagues
    this.leagueActiveOpt = this.leagueOpts[2];
  }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.preSelectedOption = this.leagueOpts[2];

    this.dataLoaded = false;
    this.subscriptions = [];
    this.hideScorebar = this.scoreBarHelperService.scorebarHidden;
    this.subscriptions.push(
      this.scoreBarHelperService.scorebarValueChanged.subscribe((val) => {
        this.hideScorebar = val;
      })
    );

    this.subscriptions.push(
      this.scoreBarHelperService.scorebarLeagueChanged.subscribe((val: string) => {
        const option = _.find(this.leagueOpts, {label: val.toUpperCase() as any});
        if (option && this.leagueActiveOpt !== option && this.dataLoaded) {
          if ((option && option.label === 'MLB') && (!this.mlbSoreItems || !this.mlbSoreItems.length)) {
            return this.preSelectedOption = option;
          }
          setTimeout(() => {
            this.onChangeLeague(option);
          });
        }
        if (!this.dataLoaded) {
          this.preSelectedOption = option;
        }
      })
    );
    if (this.isBrowser) {
      // this.getMlbScorebarData();
      // this.getNbaScorebarData();
      // this.getNflScorebarData();

      this.getNotRealTimeNbaScorebarData();

      this.nflInterval = setInterval(() => {
        this.getFreshNbaData();
        // this.getFreshNflData();
        // this.getFreshMLBData();
      }, 300000); // 5min

      setTimeout(() => {
        if (!this.scoreBarHelperService.scoreBarReady) {
          this.scoreBarHelperService.onScoreBarReady();
        }
      }, 2000);
    }
  }

  ngOnDestroy() {
    if (this.subscriptions && this.subscriptions.length) {
      this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
    }
    if (this.scoreBarReadySubscription) {
      this.scoreBarReadySubscription.unsubscribe();
    }
    if (this.nflInterval) {
      clearInterval(this.nflInterval);
    }
  }

  ngAfterViewInit() {
    if (this.swiperView) {
      this.swiperView.update();
    }
  }

  private getNotRealTimeNbaScorebarData() {
    this.scorebarService.getData('nba')
      .subscribe((nbaSoreItems) => {
        this.nbaSoreItems = this.orderGames(nbaSoreItems);
        if (this.checkIfOptionHasData('nbaSoreItems')) {
          this.leagueActiveOpt = this.leagueOpts[2];
          this.showedScoreItems = this.nbaSoreItems;
        }
        this.updateSwiperView();
        this.dataLoaded = true;
        this.scoreBarHelperService.updateSorebarLeague();
        this.scoreBarHelperService.onScoreBarReady();
      });
  }

  onChangeLeague(opt) {
    if (opt.id === 1 && this.nflSoreItems && this.nflSoreItems.length) {
      this.leagueActiveOpt = opt;
      this.setShowedScoreItems(this.nflSoreItems);
    } else if (opt.id === 0 && this.mlbSoreItems && this.mlbSoreItems.length) {
      this.leagueActiveOpt = opt;
      this.setShowedScoreItems(this.mlbSoreItems);
    } else if (opt.id === 2 && this.nbaSoreItems && this.nbaSoreItems.length) {
      this.leagueActiveOpt = opt;
      this.setShowedScoreItems(this.nbaSoreItems);
    }
  }

  checkIfOptionHasData(optPropName) {
    return this[optPropName] && this[optPropName].length;
  }

  checkIfOnlyOneOptAialable() {
    const optArr = [
      (this.nflSoreItems && this.nflSoreItems.length && 1 || 0),
      (this.mlbSoreItems && this.mlbSoreItems.length && 1 || 0),
      (this.nbaSoreItems && this.nbaSoreItems.length && 1 || 0)
    ];
    const countInArray = this.countInArray(optArr, 1);
    return countInArray === 1 || countInArray === 0;
  }

  showNBAHalftime(status) {
    return this.nbaService.showHalftime(status);
  }

  preselectMatchupId(leagueId, game_id) {
    if (!game_id) {
      return;
    }
    switch (leagueId) {
      case 0: {
        this.mlbMatchupsGatewayService.setPreSelectedMatchupId(game_id);
        break;
      }
      case 1: {
        this.nflMatchupsGatewayService.setPreSelectedMatchupId(game_id);
        break;
      }
      case 2: {
        this.nbaMatchupsGatewayService.setPreSelectedMatchupId(game_id);
        break;
      }
    }
  }

  private initScorebar() {
    let setPreSelectedOptionDataResult = false;
    if (this.preSelectedOption && this.preSelectedOption.label) {
      setPreSelectedOptionDataResult = this.setPreSelectedOptionData(this.preSelectedOption.label.toLowerCase());
    }
    if (!setPreSelectedOptionDataResult) {
      if (this.checkIfOptionHasData('nflSoreItems')) {
        this.leagueActiveOpt = this.leagueOpts[1];
        this.showedScoreItems = this.nflSoreItems;
      } else if (this.checkIfOptionHasData('nbaSoreItems')) {
        this.leagueActiveOpt = this.leagueOpts[2];
        this.showedScoreItems = this.nbaSoreItems;
      } else if (this.checkIfOptionHasData('mlbSoreItems')) {
        this.leagueActiveOpt = this.leagueOpts[0];
        this.showedScoreItems = this.mlbSoreItems;
      }
    }
    this.updateSwiperView();
    this.dataLoaded = true;
  }

  /*
  private handleUniversalScorebarApiCall() {
    observableForkJoin([
      this.scorebarService.getData('mlb'),
      this.scorebarService.getData('nfl'),
      this.scorebarService.getData('nba')
    ]).subscribe(([mlbSoreItems, nflSoreItems, nbaSoreItems]) => {
      mlbSoreItems = this.orderGames(mlbSoreItems);
      nbaSoreItems = this.orderGames(nbaSoreItems);
      this.mlbSoreItems = mlbSoreItems;
      this.nbaSoreItems = nbaSoreItems;
      // this.nflSoreItems = nflSoreItems;
      let setPreSelectedOptionResult = false;
      if (this.preSelectedOption && this.preSelectedOption.label) {
        setPreSelectedOptionResult = this.setPreSelectedOptionData(this.preSelectedOption.label.toLowerCase());
      }
      if (!setPreSelectedOptionResult) {
        if (this.checkIfOptionHasData('nbaSoreItems')) {
          this.leagueActiveOpt = this.leagueOpts[2];
          this.showedScoreItems = this.nbaSoreItems;
        } else if (this.checkIfOptionHasData('mlbSoreItems')) {
          this.leagueActiveOpt = this.leagueOpts[0];
          this.showedScoreItems = this.mlbSoreItems;
        }
        else if (this.checkIfOptionHasData('nflSoreItems')) {
          this.leagueActiveOpt = this.leagueOpts[1];
          this.showedScoreItems = this.nflSoreItems;
        }
      }
      this.updateSwiperView();
      this.dataLoaded = true;
      this.scoreBarHelperService.updateSorebarLeague();
    });
  }
  */

  private getNflScorebarData() {
    this.scorebarService.getData('nfl')
      .subscribe((nflSoreItems) => {
        this.nflSoreItems = this.orderGames(nflSoreItems);
        if (this.checkIfOptionHasData('nflSoreItems')) {
          this.leagueActiveOpt = this.leagueOpts[1];
          this.showedScoreItems = this.nflSoreItems;
        }
        this.updateSwiperView();
        this.dataLoaded = true;
        this.scoreBarHelperService.updateSorebarLeague();
      });
  }
  private getMlbScorebarData() {
    this.scorebarService.getData('mlb')
      .subscribe((mlbSoreItems) => {
        this.mlbSoreItems = this.orderGames(mlbSoreItems);
        if (this.checkIfOptionHasData('mlbSoreItems')) {
          this.leagueActiveOpt = this.leagueOpts[1];
          this.showedScoreItems = this.mlbSoreItems;
        }
        this.updateSwiperView();
        this.dataLoaded = true;
        this.scoreBarHelperService.updateSorebarLeague();
      });
  }

  private getFreshNflData() {
    this.scorebarService.getData('nfl')
      .subscribe((nflSoreItems) => {
        this.nflSoreItems = this.orderGames(nflSoreItems);
        if (this.leagueActiveOpt.id === 1) {
          this.setShowedScoreItems(nflSoreItems);
        }
      });
  }

  private getFreshNbaData() {
    this.scorebarService.getData('nba')
      .subscribe((nbaSoreItems) => {
        this.nbaSoreItems = this.orderGames(nbaSoreItems);
        if (this.leagueActiveOpt.id === 2) {
          this.setShowedScoreItems(nbaSoreItems);
        }
      });
  }

  private getFreshMLBData() {
    this.scorebarService.getData('mlb')
      .subscribe((mlbSoreItems) => {
        this.mlbSoreItems = this.orderGames(mlbSoreItems);
        if (this.leagueActiveOpt.id === 0) {
          this.setShowedScoreItems(mlbSoreItems);
        }
      });
  }

  private getNbaScorebarData() {
    this.scorebarService.getRealtimeScorebarData('nba_id/1').pipe(
      catchError(err => {
        return observableThrowError(err);
      }))
      .subscribe(nbaIds => {
        if (nbaIds && nbaIds.game_ids) {
          this.handleFBIdCollectionUpdate('nba', this.nbaSubscriptions, nbaIds.game_ids, 2);
        }
        if (this.leagueActiveOpt === this.leagueOpts[2] && this.nbaSoreItems && this.nbaSoreItems.length) {
          this.setShowedScoreItems(this.nbaSoreItems);
        }
        if (!this.dataLoaded && this.nbaSubscriptions.soreItemsIds && this.nbaSubscriptions.soreItemsIds.length && this.mlbSoreItems) {
          this.initScorebar();
        }
      });
  }

  private getRealtimeMlbScorebarData() {
    this.scorebarService.getRealtimeScorebarData('mlb_id/1').pipe(
      catchError(err => {
        return observableThrowError(err);
      }))
      .subscribe(mlbIds => {
        if (mlbIds && mlbIds.game_ids) {
          this.handleFBIdCollectionUpdate('mlb', this.mlbSubscriptions, mlbIds.game_ids, 0);
        }
        if (this.leagueActiveOpt === this.leagueOpts[0] && this.mlbSoreItems && this.mlbSoreItems.length) {
          this.setShowedScoreItems(this.mlbSoreItems);
        }
        if (this.preSelectedOption && this.preSelectedOption.label && this.mlbSoreItems && this.mlbSoreItems.length) {
          this.setPreSelectedOptionData(this.preSelectedOption.label.toLowerCase());
        } else if (!this.dataLoaded && this.mlbSubscriptions.soreItemsIds
          && this.mlbSubscriptions.soreItemsIds.length && this.nbaSoreItems) {
          this.initScorebar();
        }
      });
  }

  private handleFBIdCollectionUpdate(league, leagueSubscriptions, gameIds, leagueOptsIndex) {
    let scoreItemsArray;
    if (league === 'mlb') {
      scoreItemsArray = 'mlbSoreItems';
    } else if (league === 'nba') {
      scoreItemsArray = 'nbaSoreItems';
    } else {
      return;
    }
    leagueSubscriptions.soreItemsIds = gameIds;
    leagueSubscriptions.soreItemsIds.forEach(id => {
      if (!leagueSubscriptions.subscriptions.hasOwnProperty(id)) {
        leagueSubscriptions.subscriptions[id] = this.scorebarService.getRealtimeScorebarData(league + '/' + id)
          .subscribe((item) => {
            if (item && !Array.isArray(item)) {
              this[scoreItemsArray] = this.handleFBScoreItemUpdate(this[scoreItemsArray], item, id);
              this.scorebarService.updateScoreItems(league, this[scoreItemsArray]);
              if (!this.scoreBarHelperService.scoreBarReady && this[scoreItemsArray] && this[scoreItemsArray].length === gameIds.length) {
                setTimeout(() => {
                  if (!this.scoreBarHelperService.scoreBarReady) {
                    this.initScorebar();
                    this.scoreBarHelperService.onScoreBarReady();
                  }
                }, 0);
              }
            }
            if (this.leagueActiveOpt === this.leagueOpts[leagueOptsIndex] && this[scoreItemsArray] && this[scoreItemsArray].length) {
              if (this.scoreBarHelperService.scoreBarReady) {
                this.setShowedScoreItems(this[scoreItemsArray]);
              } else if (!this.scoreBarReadySubscription) {
                this.scoreBarReadySubscription = this.scoreBarHelperService.scoreBarReadyEvent.subscribe(() => {
                  this.setShowedScoreItems(this[scoreItemsArray]);
                });
              }
            }
          });
      }
    });
    // unsubscribe from deleted ids
    for (const key in leagueSubscriptions.subscriptions) {
      if (leagueSubscriptions.subscriptions.hasOwnProperty(key) &&
        !_.includes(leagueSubscriptions.soreItemsIds, parseInt(key, 10))) {
        leagueSubscriptions.subscriptions[key].unsubscribe();
        delete leagueSubscriptions.subscriptions[key];
        const removedElIndex = _.findIndex(this[scoreItemsArray], {fbId: parseInt(key, 10)});
        if (removedElIndex !== -1) {
          this[scoreItemsArray].splice(removedElIndex, 1);
          if (this.leagueActiveOpt === this.leagueOpts[leagueOptsIndex]) {
            if (this[scoreItemsArray].length === 0) {
              this.initScorebar();
            } else {
              this.setShowedScoreItems(this[scoreItemsArray]);
            }
          }
        }
      }
    }
  }

  private handleFBScoreItemUpdate(scoreItemArray, scoreItem, id) {
    let scoreItemToPush;
    if (scoreItem) {
      scoreItemToPush = {
        ...scoreItem,
        fbId: parseInt(id, 10)
      };
    }
    if (!scoreItemArray && scoreItemToPush) {
      return [scoreItemToPush];
    }
    if (!scoreItemArray) {
      return [];
    }
    const array = scoreItemArray.filter(item => item.fbId);
    if (scoreItem) {
      const index = _.findIndex(array, {game_id: scoreItem.game_id});
      if (index !== -1) {
        array[index] = scoreItemToPush;
        return this.orderGames(array);
      } else {
        array.push(scoreItemToPush);
        return this.orderGames(array);
      }
    }
    return array;
  }

  private updateSwiperView() {
    setTimeout(() => {
      if (this.swiperView) {
        this.swiperView.update();
      }
    })
  }

  private countInArray(array, what) {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === what) {
        count++;
      }
    }
    return count;
  }

  private setPreSelectedOptionData(league) {
    switch (league) {
      case 'mlb': {
        if (this.checkIfOptionHasData('mlbSoreItems')) {
          this.leagueActiveOpt = this.leagueOpts[0];
          this.showedScoreItems = this.mlbSoreItems;
          return true;
        }
        break;
      }
      case 'nba': {
        if (this.checkIfOptionHasData('nbaSoreItems')) {
          this.leagueActiveOpt = this.leagueOpts[2];
          this.showedScoreItems = this.nbaSoreItems;
          return true;
        }
        break;
      }
      case 'nfl': {
        if (this.checkIfOptionHasData('nflSoreItems')) {
          this.leagueActiveOpt = this.leagueOpts[1];
          this.showedScoreItems = this.nflSoreItems;
          return true;
        }
        break;
      }
    }
    return false;
  }

  private orderGames(games) {
    const finalGames = games.filter(game => game.status === 'Final').sort(this.sortByDateTime);
    const inProgressGames = games.filter(game => game.status === 'In Progress').sort(this.sortByDateTime);
    const otherGames = games.filter(game => game.status !== 'In Progress' && game.status !== 'Final').sort(this.sortByDateTime);
    return [...inProgressGames, ...otherGames, ...finalGames];
  }

  private setShowedScoreItems(scoreItems) {
    this.showedScoreItems = this.orderGames(scoreItems);
    this.updateSwiperView();
  }

  private sortByDateTime(a, b) {
    if (a.date_time < b.date_time) {
      return -1;
    }
    if (a.date_time > b.date_time) {
      return 1;
    }
    if (a.game_id < b.game_id) {
      return -1;
    }
    if (a.game_id > b.game_id) {
      return 1;
    }
    return 0;
  }
}
