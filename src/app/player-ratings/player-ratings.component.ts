import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subject } from 'rxjs';
import { PlayerRatingsService } from './player-ratings.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, switchMap, catchError, map } from 'rxjs/operators';
import { Meta } from '@angular/platform-browser';
import { NbaService } from '../nba/nba.service';
import { BreadcrumbService } from '../shared/components/breadcrumb/breadcrumb.service';
import { CommonService } from '../shared/services/common.service';
import { TitleService } from '../shared/services/title.service';
import { SpinnerService } from '../shared/components/spinner/spinner.service';
import { SchemaService } from '../shared/services/schema.service';
import { NflService } from '../nfl/nfl.service';
import { MlbService } from '../mlb/mlb.service';

interface SearchTerm {
  noSpinner: boolean,
  getDefaultData: boolean,
  updatePagination: boolean
}

@Component({
  selector: 'app-player-ratings',
  templateUrl: './player-ratings.component.html',
  styleUrls: ['./player-ratings.component.scss']
})
export class PlayerRatingsComponent implements OnInit, OnDestroy {
  searchTerm$ = new Subject<SearchTerm>();
  searchTermWithDebounceTime$ = new Subject<SearchTerm>();
  introParagraph: string;
  bottomParagraph: string;
  bottomHeader: string;
  pageHeader: string;
  currentPage = 1;
  totalItems = 0;
  playersData;
  sortBy = 'lineups_rating';
  sortOrder = 'desc';
  ddData: any = {};
  searchPlayerVal: string;
  league: string;
  itemsPerPage = 100;
  props;

  radios = ['All', 'PG', 'SG', 'SF', 'PF', 'C'];
  activeRadio = 'All';

  constructor(
    private playerRatingsService: PlayerRatingsService,
    private route: ActivatedRoute,
    private nbaService: NbaService,
    private nflService: NflService,
    private mlbService: MlbService,
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService,
    private title: TitleService,
    private spinnerService: SpinnerService,
    private schemaService: SchemaService,
    private meta: Meta
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.league = this.route.snapshot.data['league'];
      if (this.league === 'nfl') {
        this.props = {
          full_name: 'name',
          team_lineup_route: 'team_depth_chart_route',
        };
      } else {
        this.props = {
          full_name: 'full_name',
          team_lineup_route: 'team_lineup_route',
        };
      }
      this.setPageHeader();
      this.addMeta();
      this.addBreadcrumb();
      this.initSearchSubject(this.searchTerm$, 0);
      this.initSearchSubject(this.searchTermWithDebounceTime$, 600);
      this.searchTerm$.next({noSpinner: true, getDefaultData: true, updatePagination: true});
    });
  }

  ngOnDestroy() {
    this.searchTerm$.unsubscribe();
    this.searchTermWithDebounceTime$.unsubscribe();
    this.meta.removeTag('name="description"');
  }

  isTabActive(name) {
    return this.activeRadio === name;
  }

  onRadioClick(name) {
    this.activeRadio = name;
    this.filterItems();
  }

  private addBreadcrumb() {
    this.breadcrumbService.changeBreadcrumbs([
      {label: this.league.toUpperCase(), url: '/' + this.league},
      {label: this.pageHeader, url: '/' + this.league + '/player-ratings'}
    ]);
  }

  private addMeta() {
    switch (this.league) {
      case 'nba': {
        this.meta.addTag({
          name: 'description',
          // tslint:disable-next-line:max-line-length
          content: 'Player ratings and player rankings are fun. We have taken some of the subjectivity out of player ratings and looked a few key datasets (subjectivity alert).'
        });
        break;
      }
      case 'mlb': {
        this.meta.addTag({
          name: '',
          // tslint:disable-next-line:max-line-length
          content: ''
        });
        break;
      }
      case 'nfl': {
        this.meta.addTag({
          name: '',
          // tslint:disable-next-line:max-line-length
          content: ''
        });
        break;
      }
    }
  }

  private setSchema() {
    switch (this.league) {
      case 'nba': {
        this.setNbaSchema();
        break;
      }
      case 'mlb': {
        this.setMlbSchema();
        break;
      }
      case 'nfl': {
        this.setNflSchema();
        break;
      }
    }
  }

  private setNflSchema() {
    const playersSchema = [];
    if (this.playersData && this.playersData.results && this.playersData.results.length) {
      this.playersData.results.forEach(player => {
        if (player.profile_url && player.name && player.team) {
          playersSchema.push({
            '@context': 'http://schema.org',
            '@type': 'Person',
            'name': player.name,
            'url': `https://www.lineups.com${player.profile_url}`,
            'jobTitle': player.position,
            'memberOf': [
              {
                '@type': 'SportsTeam',
                'name': player.team,
                'sport': 'American Football',
                'memberOf': [{
                  '@type': 'SportsOrganization',
                  'name': 'NFL'
                }]
              }
            ]
          });
        }
      })
    }
    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      'NFL Player Ratings 2020',
      // tslint:disable-next-line:max-line-length
      'NFL player ratings using key offensive, defensive and special teams data sets. We rate based on key offensive, defensive and special teams categories. You can sort by name, team, player rating, position and search.',
      'nfl player ratings, offensive nfl player ratings, defensive nfl player ratings, special teams nfl player ratings',
      'https://www.lineups.com/nfl/player-ratings',
      'Dataset'
    ), ...playersSchema]);
  }

  private setMlbSchema() {
    const playersSchema = [];
    if (this.playersData && this.playersData.results && this.playersData.results.length) {
      this.playersData.results.forEach(player => {
        if (player.full_name && player.profile_url && player.team) {
          playersSchema.push({
            '@context': 'http://schema.org',
            '@type': 'Person',
            'name': player.full_name,
            'url': `https://www.lineups.com${player.profile_url}`,
            'jobTitle': player.position,
            'memberOf': [
              {
                '@type': 'SportsTeam',
                'name': player.team,
                'sport': 'Baseball',
                'memberOf': [{
                  '@type': 'SportsOrganization',
                  'name': 'MLB'
                }]
              }
            ]
          });
        }
      })
    }
    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      'MLB Player Ratings 2020',
      // tslint:disable-next-line:max-line-length
      'MLB player ratings using key hitting, pitching and defensive stat categories. We rate the player based on their hitting production, pitching production and defensive skills. You can sort by name, team, player rating, position and search.',
      'mlb player ratings, mlb hitter ratings, mlb pitcher ratings',
      'https://www.lineups.com/mlb/player-ratings',
      'Dataset'
    ), ...playersSchema]);
  }

  private setNbaSchema() {
    const playersSchema = [];
    if (this.playersData && this.playersData.results && this.playersData.results.length) {
      this.playersData.results.forEach(player => {
        if (player.profile_url && player.full_name && player.team) {
          playersSchema.push({
            '@context': 'http://schema.org',
            '@type': 'Person',
            'name': player.full_name,
            'url': `https://www.lineups.com${player.profile_url}`,
            'jobTitle': player.position,
            'memberOf': [
              {
                '@type': 'SportsTeam',
                'name': player.team,
                'sport': 'Basketball',
                'memberOf': [{
                  '@type': 'SportsOrganization',
                  'name': 'NBA'
                }]
              }
            ]
          });
        }
      })
    }
    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      'NBA Player Ratings 2020',
      // tslint:disable-next-line:max-line-length
      'NBA player ratings using key offensive and defensive data sets. We rate the player overall, offensively and defensively as well as some key categories. You can sort by name, team, player rating, position and search.',
      'nba player ratings, offensive nba player ratings, defensive nba player ratings',
      'https://www.lineups.com/nba/player-ratings',
      'Dataset'
    ), ...playersSchema]);
  }

  private getPlayers(page: number, teams?) {
    const params: any = {};
    if (teams) {
      params.teams = this.commonService.getActiveCheckBoxItems(teams, 'id');
    }
    if (this.league === 'nba') {
      params.positions = this.activeRadio === 'All' ? null : this.activeRadio;
    } else {
      const positions = this.ddData.positions && this.ddData.positions
          .filter(o => o.selected).length === this.playersData.position_dropdown.length ? null : this.ddData.positions;
      if (positions) {
        params.positions = this.commonService.getActiveCheckBoxItems(positions);
      }
    }
    if (this.sortBy) {
      params.sortBy = this.sortBy;
    }
    if (this.sortOrder) {
      params.orderBy = this.sortOrder;
    }
    if (this.searchPlayerVal) {
      params.player = this.searchPlayerVal;
    }
    return this.playerRatingsService.getPlayers(this.league, page, params)
  }

  filterItems(debounceTimeArg?: boolean) {
    if (debounceTimeArg) {
      return this.searchTermWithDebounceTime$.next({noSpinner: false, getDefaultData: false,  updatePagination: true});
    }
    return this.searchTerm$.next({noSpinner: false, getDefaultData: false,  updatePagination: true});
  }

  onPageChange(page) {
    this.currentPage = page;
    return this.searchTerm$.next({noSpinner: false, getDefaultData: false,  updatePagination: false});
  }

  onSortOrder(mode, $event) {
    if (mode === 'by') {
      this.sortBy = $event;
    } else if (mode === 'order') {
      this.sortOrder = $event;
    }
    this.searchTerm$.next({noSpinner: false, getDefaultData: false, updatePagination: false});
  }

  private getDDdata(playersData): {teams: [], positions?: []} {
    const leagueTeams = this[`${this.league}Service`][`${this.league}Teams`];
    const teams = playersData.team_dropdown.map((ddTeam) => {
      return {
        hidden: false,
        id: ddTeam,
        name: leagueTeams[ddTeam].team_name,
        selected: true
      }
    });
    teams.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    const res: any = {
      teams: teams
    };
    if (this.league !== 'nba') {
      res.positions = this.commonService.prepareDDItems(playersData.position_dropdown, true)
    }
    return res;
  }

  private initSearchSubject(searchTerm$, debounceTimeArg) {
    let args;
    searchTerm$
      .pipe(
        debounceTime(debounceTimeArg),
        switchMap((subject) => {
          args = subject;
          if (args.updatePagination) {
            this.currentPage = 1;
          }
          let apiCall = this.getPlayers(
            args.getDefaultData ? null : this.currentPage,
            this.ddData.teams &&
            this.ddData.teams.filter(o => o.selected).length === this.playersData.team_dropdown.length ? null : this.ddData.teams,
          );
          if (args && !args.noSpinner) {
            apiCall = this.spinnerService.handleAPICall(apiCall)
          }
          return apiCall.pipe(
            catchError((err) => {
              return EMPTY;
            }),
            map(res => res));
        })
      )
      .subscribe((playersData: any) => {
        if (playersData) {
          this.playersData = playersData;
          this.setSchema();
          if (args.getDefaultData) {
            this.setSeoData();
            this.ddData = this.getDDdata(playersData);
          }
          if (args.updatePagination) {
            this.totalItems = playersData.count;
          }
        }
      });
  }

  private setPageHeader() {
    switch (this.league) {
      case 'nba': {
        this.pageHeader = 'NBA Player Ratings 2020';
        break;
      }
      case 'mlb': {
        this.pageHeader = 'MLB Player Ratings 2020';
        break;
      }
      case 'nfl': {
        this.pageHeader = 'NFL Player Ratings 2020';
        break;
      }
    }
  }

  private setSeoData() {
    switch (this.league) {
      case 'nba': {
        // tslint:disable-next-line:max-line-length
        this.introParagraph = 'Player ratings and player rankings are fun. They get the conversation started and it never ends, because you can count on differing opinions.  Video games have taken ratings to a new level and we enjoy it. We have taken some of the subjectivity out of player ratings and looked a few key datasets (subjective alert). We’ve weighted and come up the Lineups NBA Player Ratings formula for a few categories. Feel free to continue to send your arguments and let us know what we’re doing well and poorly. Enjoy!';
        this.title.setTitle('NBA Player Ratings 2020: Overall, Offense & Defense');
        break;
      }
      case 'mlb': {
        // tslint:disable-next-line:max-line-length
        this.introParagraph = 'Creating statistics and ratings from baseball is fun and challenging. MLB has the longest history of stats and "it\'s been done before" often comes into play when brainstorming new ideas.  MLB players have the longest average career length than NFL & NBA and we have a treasure trove of options when creating player ratings.  We select some of the most important stats and create a ratings formula based on player performance over the last year.  While we don\'t manually adjust ratings, our subjective stamp is on the stats we select to analyze. Ratings are automatically updated daily while factoring in the latest performances.';
        this.title.setTitle('MLB Player Ratings 2020: Hitters, Pitchers, Defense');
        break;
      }
      case 'nfl': {
        // tslint:disable-next-line:max-line-length
        this.introParagraph = 'NFL player ratings are based on what we deem the critical offensive, defensive and special teams metrics. Ratings update each week and factor in the latest performance. We look at a number of key statistics and rate each player based on their performance in relation to the other players in the league. We subjectively select the statistics we deem critical and weight them in our formulas. You\'re sure to disagree with some and maybe agree with others.  Either way, we hope you find them useful and have some fun with them.';
        this.title.setTitle('NFL Player Ratings 2020: Offense, Defense & Special Teams');
        break;
      }
    }
  }

  filterByName(filterVal) {
    this.searchPlayerVal = filterVal;
    this.filterItems(true);
  }
}
