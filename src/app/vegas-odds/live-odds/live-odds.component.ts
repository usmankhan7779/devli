import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LiveOddsService } from './live-odds.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from '../../shared/services/common.service';
import { TitleService } from '../../shared/services/title.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { SchemaService } from '../../shared/services/schema.service';
import { CommonScheduleService } from '../../shared/services/common-schedule.service';
import { ScoreBarHelperService } from '../../score-bar/score-bar-helper.service';

@Component({
  selector: 'app-live-odds',
  templateUrl: './live-odds.component.html',
  styleUrls: ['./live-odds.component.scss']
})
export class LiveOddsComponent implements OnInit, OnDestroy {
  league: string;
  ddData;
  pageTitle: string;
  introParagraph: string;
  oddsData;
  allBetsOption: string[];
  allBooksOption: string[];
  allAdditionalBooksOption: string[];
  switchOptions: string[];
  subscriptions: Subscription[];
  subscriptionDictionary: any[];
  showMobileView = true;
  showDesktopView = true;
  activeLineMove: any;
  isIframe: boolean;
  hideIframeInfo: boolean;

  @HostListener('window:resize', ['$event']) onResize($event) {
    if ($event.target.innerWidth < 864) { // should match $mobile-view-breakdown: 864; in scss file
      this.showMobileView = true;
      this.showDesktopView = false;
    } else {
      this.showMobileView = false;
      this.showDesktopView = true;
    }
  }

  constructor(
    private commonService: CommonService,
    private titleService: TitleService,
    private breadcrumbService: BreadcrumbService,
    private liveOddsService: LiveOddsService,
    private route: ActivatedRoute,
    private router: Router,
    private schemaService: SchemaService,
    private scoreBarHelperService: ScoreBarHelperService,
    private commonScheduleService: CommonScheduleService,
  ) {
    this.hideIframeInfo = this.router.url.indexOf('v2=true') !== -1;
    this.isIframe = this.commonService.openedInIframe();
  }

  ngOnInit() {
    this.commonService.callOnResize(this.onResize.bind(this));
    this.getData();
    this.commonService.subscribeOnHeight();
  }

  ngOnDestroy() {
    if (Array.isArray(this.subscriptions)) {
      this.subscriptions.forEach((subscription: Subscription) => {
        subscription.unsubscribe();
      })
    }
    if (this.commonService.isBrowser()) {
      window.removeEventListener('message', this.commonService.heightListener);
    }
  }

  private setOptions(league: string) {
    switch (league) {
      case 'nba': {
        this.allBetsOption = [
            'Spread',
            'Moneyline',
            'Totals',
            'Over/Under'
          ];
        this.allAdditionalBooksOption = [
          // 'Bovada',
          // 'Pinnacle',
          // 'Sportsbook.com',
          // 'GTBets',
          // 'BetOnline'
        ];
        this.allBooksOption = [
          'MGM Mirage',
          'William Hill',
          'Wynn',
          'Caesars',
          'Treasure Island',
          'Westgate'
        ];
        this.switchOptions = [
            'all-books-all-bets',
            'all-books-one-bet',
            'one-book-bets'
          ];
        break;
      }
      default: {
        this.allBetsOption = [
          'Spread',
          'Moneyline',
          'Over/Under'
        ];
        this.allBooksOption = [
          'MGM Mirage',
          'William Hill',
          'Wynn',
          'Caesars',
          'Treasure Island',
          'Westgate'
        ];
        this.allAdditionalBooksOption = [
          // 'Bovada',
          // 'Pinnacle',
          // 'Sportsbook.com',
          // 'GTBets',
          // 'BetOnline',
          // 'MyBookie'
        ];
        this.switchOptions = [
          'all-books-all-bets',
          'all-books-one-bet',
          'one-book-bets'
        ];
        break;
      }
    }
  }

  private getData() {
    this.league = this.route.snapshot.data['league'];
    setTimeout(() => {
      this.scoreBarHelperService.changeScorebarLeague(this.league);
    });
    this.setOptions(this.league);
    if (!this.league) {
      return console.error('You have to provide league for this component');
    }
    this.liveOddsService.getLiveOdds(this.league)
      .subscribe((res) => {
        this.pageTitle = res.page_heading || res.heading || `${this.league.toUpperCase()} Live Vegas Odds`;
        this.introParagraph = res.intro_paragraph;
        this.breadcrumbService.changeBreadcrumbs([
          {label: 'Vegas Odds', url: '/vegas-odds'},
          {label: this.pageTitle, url: `/vegas-odds/${this.league.toLowerCase()}-live-vegas-odds`},
        ]);
        this.titleService.setTitle(res.page_title || `Free ${this.league.toUpperCase()} Live Vegas Odds`);

        this.oddsData = this.processGames(this.formatData(res.results));
        this.subscriptionDictionary = this.createSubscriptionDictionaryArray();
        // this.subscribeOnRealtimeOddsUpdate(this.league, this.subscriptionDictionary);

        const bets = [
          'All Bets',
          ...this.allBetsOption
          // 'Prop Bets'
        ];
        const books = [
          ...this.allBooksOption,
          ...this.allAdditionalBooksOption
        ];
        books.sort().unshift('Vegas Books');
        const activeBets = 'All Bets';
        const activeBook = 'Vegas Books';

        this.ddData = {
          books: books.map(item => {
            return {
              name: item,
              selected: item === activeBook,
            }
          }),
          activeBook,
          activeBets: this.allBetsOption,
          bets: bets.map(item => {
            return {
              name: item,
              selected: item === activeBets,
            }
          }),
        };

        this.setSchema();

        if (this.commonService.isBrowser() && this.commonService.openedInIframe()) {
          setTimeout(() => {
            this.commonService.heightListener({data: 'FrameHeight', source: window.parent});
          }, 200);
        }

      });
  }

  filterItems() {
    this.ddData.activeBook = this.commonService.getActiveCheckBoxItems(this.ddData.books, 'name')[0];
    let activeBets: any = this.commonService.getActiveCheckBoxItems(this.ddData.bets, 'name');
    if (activeBets[0] === 'All Bets') {
      activeBets = this.allBetsOption;
    }
    this.ddData.activeBets = activeBets;
    this.liveOddsService.triggerDDupdate(this.ddData);
  }

  onLineClick(matchup) {
    if (matchup) {
      return this.activeLineMove = this.liveOddsService.getMatchupId(matchup);
    }
    return this.activeLineMove = null;
  }

  getSwitchOptionNumber() {
    if (this.ddData.activeBook === 'Vegas Books') {
      if (this.ddData.activeBets === this.allBetsOption) {
        return this.switchOptions[0];
      }
      return this.switchOptions[1];
    }
    return this.switchOptions[2];
  }

  private formatData(data) {
     const updatedData = data.filter(item => item.away && item.home && (this.league !== 'nba' && item.matchup_route || this.league === 'nba') && item.date_time).map(item => {
      const awayBets = item.away.bets.slice(0);
      const homeBets = item.home.bets.slice(0);

      item.away.bets = this.groupBets(awayBets);
      item.home.bets = this.groupBets(homeBets);
      return item;
    });
    return this.commonScheduleService.processWeekGames(updatedData);
  }

  private processGames(data) {
    let resData;
    if (this.league === 'mlb') {
      resData = data.filter(game => this.checkIfToday(game.date));
    }
    if (this.isIframe && this.league === 'nba' && this.hideIframeInfo && data && data[0]) {
      resData = [data[0]];
    }
    return resData || data;
  }

  private groupBets(bets) {
    const groupedByBookmakerNameBets: any = _.groupBy(bets, 'bookmaker_name');
    for (const key in groupedByBookmakerNameBets) {
      if (groupedByBookmakerNameBets.hasOwnProperty(key)) {
        groupedByBookmakerNameBets[key] = _.groupBy(groupedByBookmakerNameBets[key], 'bet_type');
        for (const innerKey in groupedByBookmakerNameBets[key]) {
          if (groupedByBookmakerNameBets[key].hasOwnProperty(innerKey)) {
            groupedByBookmakerNameBets[key][innerKey] = groupedByBookmakerNameBets[key][innerKey][0];
          }
        }
      }
    }
    if (!groupedByBookmakerNameBets['Lineups.com']) {
      groupedByBookmakerNameBets['Lineups.com'] = {};
    }
    return groupedByBookmakerNameBets;
  }

  checkIfToday(date) {
    return moment(date).isSame(new Date(), 'day');
  }


  private subscribeOnRealtimeOddsUpdate(league, subscriptionDictionary) {
    this.subscriptions = [];
    subscriptionDictionary.forEach((item: {id: string, key: string}) => {
      const subscription = this.liveOddsService.getRealtimeLeagueOdds(league, item.id)
        .subscribe(response => {
          if (item && !Array.isArray(response)) {
            this.handleRealtimeOddsUpdate(item, response);
          }
        });
      this.subscriptions.push(subscription);
    })
  }

  private handleRealtimeOddsUpdate(item, res) {
    let value = this.oddsData;
    for (const propToUpdate of item.key.split(',')) {
      if (value) {
        value = value[propToUpdate];
      }
    }
    for (const key in res) {
      if (res.hasOwnProperty(key)) {
        value[key] = res[key];
      }
    }
  }

  private createSubscriptionDictionaryArray() {
    const dictionaryArr = [];
    this.oddsData.forEach((date, dateIndex) => {
      date.games.forEach((game, gemeIndex) => {

        Object.keys(game.away.bets).map((book) => {
          Object.keys(game.away.bets[book]).map((odd) => {
            dictionaryArr.push({
              key: `${dateIndex},games,${gemeIndex},away,bets,${book},${odd}`,
              id: game.away.bets[book][odd].fb_id
            });
          });
        });

        Object.keys(game.home.bets).map((book) => {
          Object.keys(game.home.bets[book]).map((odd) => {
            dictionaryArr.push({
              key: `${dateIndex},games,${gemeIndex},home,bets,${book},${odd}`,
              id: game.home.bets[book][odd].fb_id
            });
          });
        });

      });
    });
    return dictionaryArr;
  }

  private setSchema() {
    if (this.league === 'nba') {
      let teamsSchema = [];
      if (this.oddsData && this.oddsData.length) {
        this.oddsData.forEach((day) => {
          if (day && day.games && day.games.length) {
            day.games.forEach(game => {
              teamsSchema.push(this.generateNbaTeamSchema('home', game), this.generateNbaTeamSchema('away', game));
            });
          }
        })
      }
      teamsSchema = _.uniq(teamsSchema);
      this.schemaService.addSchema([this.commonService.generateDatasetSchema(
        'NBA Vegas Odds',
        // tslint:disable-next-line:max-line-length
        'NBA live vegas odds for the top sportsbooks. Odds include spread, moneyline, total, over, under as well as line movement charts and difference in odds from open to live.  Sportsbooks include MGM Mirage, William Hill, Wynn, Caesars, Treasure Island, Westgate',
        'nba vegas odds, nba live odds, nba live vegas odds',
        'https://www.lineups.com/vegas-odds/nba-live-vegas-odds',
        'Dataset'
      ), ...teamsSchema]);
    } else if (this.league === 'nfl') {
      let teamsSchema = [];
      if (this.oddsData && this.oddsData.length) {
        this.oddsData.forEach((day) => {
          if (day && day.games && day.games.length) {
            day.games.forEach(game => {
              teamsSchema.push(this.generateNflTeamSchema('home', game), this.generateNflTeamSchema('away', game));
            });
          }
        })
      }
      teamsSchema = _.uniq(teamsSchema);
      this.schemaService.addSchema([this.commonService.generateDatasetSchema(
        'NFL Vegas Odds',
        // tslint:disable-next-line:max-line-length
        'NFL live vegas odds for the top sportsbooks. Odds include spread, moneyline, total, over, under as well as line movement charts and difference in odds from open to live.  Sportsbooks include MGM Mirage, William Hill, Wynn, Caesars, Treasure Island, Westgate',
        'nfl vegas odds, nfl live odds, nfl live vegas odds',
        'https://www.lineups.com/vegas-odds/nfl-live-vegas-odds',
        'Dataset'
      ), ...teamsSchema]);
    }
  }

  private generateNbaTeamSchema(mode: 'home' | 'away', game) {
    return {
      '@context': 'http://schema.org',
      '@type': 'SportsTeam',
      'name': game[mode].team_name,
      'sport': 'Basketball',

      'url': `https://www.lineups.com${game[mode].lineup_route}`,

      'memberOf': [
        {
          '@type': 'SportsOrganization',
          'name': 'NBA'
        }
      ]
    };
  }

  private generateNflTeamSchema(mode: 'home' | 'away', game) {
    return {
      '@context': 'http://schema.org',
      '@type': 'SportsTeam',
      'name': game[mode].team_name,
      'sport': 'American Football',

      'url': `https://www.lineups.com${game[mode].depth_chart_route}`,

      'memberOf': [
        {
          '@type': 'SportsOrganization',
          'name': 'NFL'
        }
      ]
    };
  }
}
