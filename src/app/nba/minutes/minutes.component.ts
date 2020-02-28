
import { EMPTY, Subject, Observable, forkJoin } from 'rxjs';

import {map, catchError, switchMap, debounceTime} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MinutesService } from './minutes.service';
import { CommonService } from '../../shared/services/common.service';
import { DropdownService } from '../../shared/components/dropdown/dropdown.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { ServerResponseService } from '../../shared/services/server-response.service';
import { TitleService } from '../../shared/services/title.service';
import { NbaService } from '../nba.service';
import { SchemaService } from '../../shared/services/schema.service';
import { FantasyProjectionsService } from './fantasy-projections/fantasy-projections.service';

@Component({
  selector: 'app-minutes',
  templateUrl: './minutes.component.html',
  styleUrls: ['./minutes-top-section.scss', './minutes.component.scss']
})
export class MinutesComponent implements OnInit, OnDestroy {
  pageHeading: string;
  dropdownCollapsed: boolean;
  minutesDDs: any;
  data: any = {};
  bottomInfo: any = {};
  itemsPerPage: number;
  totalItems: number;
  csvText;
  csvShowed = false;
  searchModel: string;
  introParagraph: string;
  searchTerm$ = new Subject<any>();
  searchByNameTerm$ = new Subject<any>();
  isOffseason: boolean;
  currentPage = 0;
  currentYear;
  realYear;
  sortByFantasy;
  sortOrderFantasy;

  sortByMinutes = 'minutes';
  sortOrderMinutes = 'desc';

  sortByStats;
  sortOrderStats;

  isMinutes36: boolean;

  colorConfig = this.fantasyProjectionsService.colorConfig;

  constructor(
    private minutesService: MinutesService,
    private commonService: CommonService,
    private dropdownService: DropdownService,
    private nbaService: NbaService,
    private route: ActivatedRoute,
    private title: TitleService,
    private breadcrumbService: BreadcrumbService,
    private serverResponseService: ServerResponseService,
    private schemaService: SchemaService,
    private fantasyProjectionsService: FantasyProjectionsService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    this.initSearchSubject(this.searchTerm$, 0);
    this.initSearchSubject(this.searchByNameTerm$, 700);
    this.route.params.subscribe(params => {
      this.isOffseason = this.nbaService.checkIfOffSeason(this.route.snapshot.data['minutesData']['seasons']);
      this.dropdownCollapsed = true;
      this.pageHeading = this.route.snapshot.data['breadcrumb'];
      this.minutesDDs = this.minutesService.getDddObj(this.route.snapshot.data['main']);
      this.minutesDDs.items_per_page = this.commonService.prepareDDItems([50, 100, 200, 500], true, false);
      this.minutesDDs.items_per_page[0].selected = true;
      if (this.minutesDDs.activeMain.prop === 'minutes') {
        this.searchByNameTerm$.unsubscribe();
        this.itemsPerPage = this.minutesDDs.items_per_page[0].name;
        this.searchTerm$.next({noSpinner: true});
      } else {
        const savedDDs = this.minutesService.getSavedDD();
        if (savedDDs && savedDDs.teams && savedDDs.teams.length) {
          this.minutesDDs.teams = savedDDs.teams;
          this.onTeamDropdownChange(false);
        }
        if (this.minutesDDs.activeMain.prop === 'stats') {
          this.currentYear = (params['year'] || 'current') + '';
          this.realYear = (params['year'] || this.route.snapshot.data['minutesData']['currentSeason']) + '';
          this.minutesDDs.seasons = this.route.snapshot.data['minutesData']['seasons'];
          this.minutesDDs.third[1].hidden = true;
          // if (this.currentYear !== 'current' ||
          //   ( this.currentYear === 'current' && this.nbaService.checkIfOffSeason(this.route.snapshot.data['minutesData']['seasons']) )
          // ) {
            this.minutesService.selectDDoption(this.minutesDDs, 'activeThird', 'third', 'per_game');
            this.minutesService.selectDDoption(this.minutesDDs, 'activeSecondary', 'secondary', 'season');
          // }
        } else {
          this.currentYear = '';
        }

        this.itemsPerPage = this.minutesDDs.items_per_page[0].name;
        this.searchTerm$.next({noSpinner: true});
      }
    });
  }

  ngOnDestroy() {
    this.searchTerm$.unsubscribe();
    this.searchByNameTerm$.unsubscribe();
  }

  filterByName(filterVal) {
    this.searchModel = filterVal;
    this.searchByNameTerm$.next();
  }

  checkActiveYear(year1, year2) {
    return parseInt(year1, 10) === parseInt(year2, 10);
  }

  onYearDdChange(season) {
    if (parseInt(this.realYear, 10) === parseInt(season.year, 10)) {
      return;
    }
    this.currentPage = 0;
    this.realYear = season.year;
    this.currentYear = this.nbaService.checkIfDefaultSeason(season.year, this.minutesDDs.seasons) ? 'current' : season.year;
    if (this.currentYear !== 'current' ||
      ( this.currentYear === 'current' && this.nbaService.checkIfOffSeason(this.route.snapshot.data['minutesData']['seasons']) )
    ) {
      this.minutesService.selectDDoption(this.minutesDDs, 'activeThird', 'third', 'per_game');
      this.minutesService.selectDDoption(this.minutesDDs, 'activeSecondary', 'secondary', 'season');
    }
    this.searchTerm$.next({noSpinner: false});
  }

  onCsvShow() {
    this.csvShowed = !this.csvShowed;
  }

  onThirdDropdownChange(callApi = true) {
    if (this.minutesDDs.activeMain.prop === 'fantasy') {
      const prevActiveThirdFantasy = this.minutesDDs.activeThirdFantasy;
      this.minutesDDs.activeThirdFantasy = this.commonService.getActiveCheckBoxItems(this.minutesDDs.thirdFantasy, 'prop')[0];
      // sort bug fix after 3rd dd change
      setTimeout(() => {
        this.handleMinutesTableSortingAfterDdChange('sortByFantasy',
          this.minutesDDs.activeThirdFantasy, prevActiveThirdFantasy, 'thirdFantasy');
      }, 10);
    } else {
      const prevActiveThird = this.minutesDDs.activeThird;
      this.minutesDDs.activeThird = this.commonService.getActiveCheckBoxItems(this.minutesDDs.third, 'prop')[0];
      setTimeout(() => {
        this.handleMinutesTableSortingAfterDdChange('sortByStats', this.minutesDDs.activeThird, prevActiveThird, 'third');
      }, 10);
    }
    if (callApi) {
      setTimeout(() => {
        this.searchTerm$.next();
      }, 15);
    }
  }

  onApiDropdownChange(page) {
    this.searchModel = '';
    if (page) {
      this.currentPage = page;
      return this.searchTerm$.next();
    }
    const newItemsPerPage = this.commonService.getActiveCheckBoxItems(this.minutesDDs.items_per_page, 'name')[0];
    if (this.itemsPerPage !== newItemsPerPage) {
      this.itemsPerPage = newItemsPerPage;
      return this.searchTerm$.next();
    }
    this.minutesDDs.activeSecondary = this.commonService.getActiveCheckBoxItems(this.minutesDDs.secondary, 'prop')[0];
    if (this.minutesDDs.activeSecondary === 'season') {
      this.minutesDDs.third[1].hidden = false;
    } else {
      this.minutesDDs.third[1].hidden = true;
      if (this.minutesDDs.activeThird === 'per_possession') {
        this.dropdownService.selectActiveItems(this.minutesDDs.third, ['per_36'], 'prop');
        this.onThirdDropdownChange(false);
      }
    }
    setTimeout(() => {
      this.searchTerm$.next();
    }, 15);
  }

  onTeamDropdownChange(callApi = true) {
    this.minutesDDs.activeTeams = this.commonService.getActiveCheckBoxItems(this.minutesDDs.teams, 'name');
    this.minutesService.saveDD({teams: this.minutesDDs.teams});
    if (this.minutesDDs.activeTeams.length === 0) {
      this.minutesDDs.activeTeams = ['null'];
    }
    if (this.minutesDDs.activeTeams.length === this.minutesDDs.teams.length) {
      this.minutesDDs.activeTeams = [];
    }
    if (callApi) {
      this.searchByNameTerm$.next();
    }
  }

  onSortOrder(sortBy, sortOrder, mode, $event) {
    if (mode === 'by') {
      this[sortBy] = $event;
    } else if (mode === 'order') {
      this[sortOrder] = $event;
    }
    if (this.minutesDDs.activeMain.prop !== 'minutes') {
      this.searchTerm$.next({noSpinner: false});
    }
  }

  private handleMinutesTableSortingAfterDdChange(sortBy, ddVal, prevDDVal, thirdName) {
    if (this[sortBy] && (this[sortBy].indexOf(this.minutesDDs[thirdName][0].prop) !== -1 ||
      this[sortBy].indexOf(this.minutesDDs[thirdName][1].prop) !== -1 || (
          this.minutesDDs[thirdName][2] && this[sortBy].indexOf(this.minutesDDs[thirdName][2].prop) !== -1))) {
      this[sortBy] = this.commonService.replaceStrAll(this[sortBy], prevDDVal, ddVal);
    }
  }

  private updateCSVText(main) {
    switch (main) {
      case this.minutesDDs.main[0].prop: {
        this.csvText = this.commonService.generateCSV(this.csvFormatMinutes(this.data[main]));
        break;
      }
      case this.minutesDDs.main[1].prop: {
        this.csvText = this.commonService.generateCSV(this.csvFormatStats(this.data[main]));
        break;
      }
      case this.minutesDDs.main[3].prop: {
        this.csvText = this.commonService.generateCSV(this.csvFormatFantasy(this.data[main]));
        break;
      }
    }
  }

  private csvFormatMinutes(minutes: any) {
    return minutes.results.map((obj) => {
      const resObj = {};
      resObj['Name'] = obj.full_name;
      resObj['Pos'] = obj.position;
      // resObj['Rating'] = obj.lineups_rating;
      resObj['Team'] = obj.team;
      resObj['Opponent'] = obj.opponent;
      resObj['Projected Minutes'] = obj.minutes;
      resObj['Fantasy Points Per Minute'] = obj.fppm;
      // resObj['Minutes Per Game'] = null;
      // resObj['Total Minutes'] = null;
      return resObj;
    });
  }

  private csvFormatStats(stats: any) {
    return stats.results.map((obj) => {
      const resObj = {};
      resObj['Name'] = obj.full_name;
      // resObj['Team'] = obj.team;
      resObj['Pos'] = obj.position;
      resObj['Rating'] = obj.lineups_rating;
      resObj['Game'] = (obj.game.away && obj.game.home ? `${obj.game.away} at  ${obj.game.home}` : '');
      if (this.minutesDDs.activeThird === 'per_possession') {
        resObj['MIN'] = obj[this.minutesDDs.activeThird].minutes;
      }
      if (this.minutesDDs.activeThird === 'per_game') {
        resObj['MIN/G'] = obj[this.minutesDDs.activeThird].minutes;
      }
      resObj['PTS'] = obj[this.minutesDDs.activeThird].points;
      resObj['AST'] = obj[this.minutesDDs.activeThird].assists;
      resObj['REB'] = obj[this.minutesDDs.activeThird].rebounds;
      resObj['STL'] = obj[this.minutesDDs.activeThird].steals;
      resObj['BLK'] = obj[this.minutesDDs.activeThird].blocked_shots;
      resObj['TOV'] = obj[this.minutesDDs.activeThird].turnovers;
      resObj['ORB'] = obj[this.minutesDDs.activeThird].offensive_rebounds;
      resObj['3PM'] = obj[this.minutesDDs.activeThird].three_pointers_made;
      resObj['3PA'] = obj[this.minutesDDs.activeThird].three_pointers_attempted;
      resObj['FTM'] = obj[this.minutesDDs.activeThird].free_throws_made;
      resObj['FTA'] = obj[this.minutesDDs.activeThird].free_throws_attempted;
      resObj['PF'] = obj[this.minutesDDs.activeThird].personal_fouls;
      return resObj;
    });
  }

  private csvFormatFantasy(fantasy: any) {
    return fantasy.results.map((obj) => {
      const resObj = {};
      resObj['Name'] = obj.full_name;
      resObj['Pos'] = obj.position;
      resObj['Rating'] = obj.lineups_rating;
      resObj['Team'] = obj.team;
      if (this.minutesDDs.activeSecondary === 'season') {
        resObj['Fantasy Points'] = obj['fantasy_points_' + this.minutesDDs.activeThirdFantasy];
      }
      resObj['FPPG'] = obj.fantasy_points[this.minutesDDs.activeThirdFantasy + '_per_game'];
      resObj['FPPM'] = obj.fantasy_points[this.minutesDDs.activeThirdFantasy + '_per_minute'];
      for (const header of fantasy.headers) {
        resObj[header] = obj.fantasy_points[this.minutesDDs.activeThirdFantasy][header];
      }
      return resObj;
    });
  }

  private initSearchSubject(searchTerm$, debounceTimeArg) {
    searchTerm$
      .pipe(
        debounceTime(debounceTimeArg),
        switchMap((subject) => {
          let apiCall = this.minutesService.getMinutes(
            this.currentYear,
            this.minutesDDs.activeMain.prop,
            this.minutesDDs.activeSecondary,
            this.minutesDDs.activeTeams,
            this.currentPage,
            this.itemsPerPage,
            this.getActiveSortBy(),
            this.getActiveSortOrder(),
            this.searchModel
          );
          if (this.minutesDDs.activeMain.prop === 'minutes') {
            apiCall = forkJoin([apiCall, this.fantasyProjectionsService.getPlayers(true)]);
          }
          if (!subject || !(<any>subject).noSpinner) {
            apiCall = this.spinnerService.handleAPICall(apiCall)
          }
          return apiCall.pipe(
            catchError((err) => {
              if (this.serverResponseService.checkCurrentSeasonRedirectApiError(err)) {
                console.error('ERR', err);
                const redirectUrl = `/nba/player-stats`;
                return this.serverResponseService.redirect(redirectUrl);
              } else {
                console.error('ERR', err);
              }
              return EMPTY;
            }),
            map(res => res));
        })
      )
      .subscribe((response) => {
        let res;
        if (response) {
          if (this.minutesDDs.activeMain.prop === 'minutes') {
            res = response[0];
            res.results = response[1];
            res.count = res.results.length;
          } else {
            res = response;
          }
          this.data[this.minutesDDs.activeMain.prop] = res;
          if (res.teams_dropdown && !this.minutesDDs.teams && this.minutesDDs.activeMain.prop !== 'minutes') {
            this.minutesDDs.teams = this.commonService.prepareDDItems(res.teams_dropdown, true, true, false, true);
          }
          this.totalItems = res.count;
          if (res.page_title) {
            this.title.setTitle(res.page_title);
          }
          this.introParagraph = res.intro_paragraph;
          this.bottomInfo = {
            bottom_header: res.bottom_header,
            bottom_paragraph: res.bottom_paragraph
          };
          this.pageHeading = res.heading;

          this.setSchema(this.minutesDDs.activeMain.prop);

          this.breadcrumbService.changeBreadcrumbs([
            { label: 'NBA', url: '/nba' },
            { label: 'Players', url: '/nba/players' },
            { label: res.heading, url: './' }
          ]);
          if (this.minutesDDs.activeMain.prop === 'minutes' && !this.sortByMinutes) {
            // if (this.isOffseason) {
            //   this.sortByMinutes = this.minutesDDs.activeThird + '.minutes';
            // } else {
            //   this.sortByMinutes = `minutes.${res.headers[res.headers.length - 1]}`;
            // }
            // this.sortOrderMinutes = 'desc';
          }
          if (this.minutesDDs.activeMain.prop === 'stats' && !this.sortByStats) {
            this.sortByStats = this.minutesDDs.activeThird + '.points';
            this.sortOrderStats = 'desc';
          }
          if (this.minutesDDs.activeMain.prop === 'fantasy' && !this.sortByFantasy) {
            // this.sortByFantasy = 'fantasy_projections.fan_duel.projection';
            // this.sortOrderFantasy = 'desc';
          }
          this.updateCSVText(this.minutesDDs.activeMain.prop);
        }
      });
  }

  private getActiveSortBy() {
    switch (this.minutesDDs.activeMain.prop) {
      case this.minutesDDs.main[0].prop: {
        return this.sortByMinutes;
      }
      case this.minutesDDs.main[1].prop: {
        return this.sortByStats;
      }
      case this.minutesDDs.main[3].prop: {
        return this.sortByFantasy;
      }
    }
  }

  private getActiveSortOrder() {
    switch (this.minutesDDs.activeMain.prop) {
      case this.minutesDDs.main[0].prop: {
        return this.sortOrderMinutes;
      }
      case this.minutesDDs.main[1].prop: {
        return this.sortOrderStats;
      }
      case this.minutesDDs.main[3].prop: {
        return this.sortOrderFantasy;
      }
    }
  }

  private generatePlayersSchema(type) {
    return this.data[type].results.slice(0, 50).map((player) => {
      return {
        '@context': 'http://schema.org',

        '@type': 'Person',

        'name': player.full_name,

        'url': 'https://www.lineups.com' + player.profile_url,

        'jobTitle': player.position,

        'memberOf': [
          {
            '@type': 'SportsTeam',
            'name': player.team,
            'sport': 'Basketball',
            'memberOf': [
              {
                '@type': 'SportsOrganization',
                'name': 'NBA'
              }
            ]
          }
        ]
      }
    });
  }

  onItemsPerPageChange() {
    this.itemsPerPage =  this.commonService.getActiveCheckBoxItems(this.minutesDDs['items_per_page'], 'name')[0];
    this.updateCSVText(this.minutesDDs.activeMain.prop);
  }

  private setSchema(pageType) {
    let playersSchema = [];
    if (this.data && this.data[pageType] && this.data[pageType].results && this.data[pageType].results.length) {
      playersSchema = this.generatePlayersSchema(pageType)
    }
    let pageDataSet;
    switch (pageType) {
      case this.minutesDDs.main[0].prop: {
        pageDataSet = this.commonService.generateDatasetSchema(
          'NBA Minutes per game',
          // tslint:disable-next-line:max-line-length
          'NBA player minutes per game, per 36 minutes and per 100 possessions. Filter by last 10 games, last 30 games and season. Data displayed is player name, position, rating, game, total minutes, minutes per game, points, rebounds and assists.',
          'nba minutes per game, nba minutes, nba player minutes',
          'https://www.lineups.com/nba/nba-player-minutes-per-game',
          'Dataset'
        );
        break;
      }
      case this.minutesDDs.main[1].prop: {
        pageDataSet = this.commonService.generateDatasetSchema(
          'NBA Player Stats',
          // tslint:disable-next-line:max-line-length
          'NBA player stats over the past 10 games, 30 games and season.  Filter stats based on every 36 minutes, per 100 possessions or per game. Data includes player name, position, rating, game points, assists, rebounds, steals, blocks, turnovers, offensive rebound, 3 points made, 3 pointers attempted, free throws made, free throws attempted, usage percentage and personal fouls.',
          'nba player stats,  nba stats',
          'https://www.lineups.com/nba/player-stats',
          'Dataset'
        );
        break;
      }
      case this.minutesDDs.main[3].prop: {
        pageDataSet = this.commonService.generateDatasetSchema(
          'NBA Fantasy Points Scored Per Game',
          // tslint:disable-next-line:max-line-length
          'NBA fantasy basketball points per game for fanduel and draftkings websites. Includes player salary, game, ratings, position, projection and fantasy points scored over the past 10 games, 30 games or season. Fantasy points per game and fantasy points per minute is also available.',
          'nba fantasy points per game, nba fantasy points scored per game',
          'https://www.lineups.com/nba/fantasy-points-per-game',
          'Dataset'
        );
        break;
      }
    }
    this.schemaService.addSchema([pageDataSet, ...playersSchema]);
  }

  onPageChange(page) {
    this.currentPage = page;
    this.updateCSVText(this.minutesDDs.activeMain.prop);
  }
}
