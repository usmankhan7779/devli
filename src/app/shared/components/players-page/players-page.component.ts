
import {EMPTY, Observable, Subject } from 'rxjs';

import {map, catchError, debounceTime, switchMap} from 'rxjs/operators';
import { Component, Inject, Injector, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { PlayersPageService } from './players-page.service';
import { SpinnerService } from '../spinner/spinner.service';
import { PlayerNewsModalComponent } from '../../modals/player-news-modal/player-news-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';
import { TitleService } from '../../services/title.service';
import { SchemaService } from '../../services/schema.service';

interface SearchTerm {
  noSpinner: boolean,
  getDefaultData: boolean,
  updatePagination: boolean
}

@Component({
  selector: 'app-players-page',
  templateUrl: './players-page.component.html',
  styleUrls: ['./players-page.component.scss']
})
export class PlayersPageComponent implements OnInit, OnDestroy {
  @Input() currentLeague: string;
  @Input() itemsPerPage = 100;
  searchTerm$ = new Subject<SearchTerm>();
  searchTermWithDebounceTime$ = new Subject<SearchTerm>();
  introParagraph: string;
  bottomParagraph: string;
  bottomHeader: string;
  currentPage = 1;
  totalItems: number;
  playersData;
  sortBy;
  sortOrder;
  ddData: any = {};
  searchPlayerVal: string;

  props;

  private modalService;

  constructor(
    private playersPageService: PlayersPageService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService,
    private title: TitleService,
    private spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector,
    private schemaService: SchemaService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService = this.injector.get(NgbModal);
    }
  }

  ngOnInit() {
    if (!this.currentLeague) {
      this.currentLeague = this.route.snapshot.data['url'].toLowerCase();
    }
    if (this.currentLeague === 'nfl') {
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
    const leagueBreadcrumbUrl = this.currentLeague === 'cfb' ? 'college-football' : this.currentLeague;
    this.breadcrumbService.changeBreadcrumbs([
      {label: this.currentLeague.toUpperCase(), url: `/${leagueBreadcrumbUrl}`},
      {label: this.currentLeague.toUpperCase() + ' Players', url: `/${leagueBreadcrumbUrl}/players`}
    ]);
    this.initSearchSubject(this.searchTerm$, 0);
    this.initSearchSubject(this.searchTermWithDebounceTime$, 600);
    this.searchTerm$.next({noSpinner: true, getDefaultData: true, updatePagination: true});
  }

  ngOnDestroy() {
    this.searchTerm$.unsubscribe();
    this.searchTermWithDebounceTime$.unsubscribe();
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
      'NBA Players',
      // tslint:disable-next-line:max-line-length
      'All NBA players that are active are listed in a table with player name, recent news, position, number, rating and links to their team lineup and roster.  Sort by position, team or search by player name.',
      'nba players, active nba players, list of nba players',
      'https://www.lineups.com/nba/players',
      'Dataset'
    ), ...playersSchema]);
  }

  private setMlbSchema() {
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
      'MLB Players',
      // tslint:disable-next-line:max-line-length
      'All MLB players that are active are listed in a table with player name, position, number, rating and links to their team lineup and roster. Sort by position, team or search by player name.',
      'mlb players, active mlb players, list of mlb players',
      'https://www.lineups.com/mlb/players',
      'Dataset'
    ), ...playersSchema]);
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
      'NFL Players',
      // tslint:disable-next-line:max-line-length
      'All NFL players that are active are listed in a table with player name, recent news, position, number, rating and links to their team depth chart and roster.  Sort by position, team or search by player name.',
      'nfl players, active nfl players, list of nfl players',
      'https://www.lineups.com/nfl/players',
      'Dataset'
    ), ...playersSchema]);
  }

  private getPlayers(page: number, teams?, positions? /*, seasons?, itemsPerPage?: number*/) {
    const params: any = {};
    if (teams) {
      params.teams = this.currentLeague === 'cfb' ?
        this.commonService.getActiveCheckBoxItems(teams) : this.commonService.getActiveCheckBoxItems(teams, 'id');
    }
    // if (seasons) {
    //   params.year = this.commonService.getActiveCheckBoxItems(seasons, 'year')[0];
    // }
    if (positions) {
      params.positions = this.commonService.getActiveCheckBoxItems(positions);
    }
    // if (itemsPerPage) {
    //   params.itemsPerPage = itemsPerPage;
    // }
    if (this.sortBy) {
      params.sortBy = this.sortBy;
    }
    if (this.sortOrder) {
      params.orderBy = this.sortOrder;
    }
    if (this.searchPlayerVal) {
      params.player = this.searchPlayerVal;
    }
    return this.playersPageService.getPlayers(this.currentLeague, page, params)
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

  // setItemsPerPage(value: number) {
  //   this.itemsPerPage = value;
  //   this.filterItems();
  // }

  onSortOrder(mode, $event) {
    if (mode === 'by') {
      this.sortBy = $event;
    } else if (mode === 'order') {
      this.sortOrder = $event;
    }
    this.searchTerm$.next({noSpinner: false, getDefaultData: false, updatePagination: false});
  }

  onPlayerHistoryClick(isActive: boolean, id: number) {
    if (!isActive) {
      return;
    }
    let players = this.playersData.results.filter(player => player.has_news);
    players = players.map(player => {
      return {
        player_id: player.player_id,
        name: player.full_name || player.name,
        type: player.position,
        team: player.team
      };
    });
    const modalRef = this.modalService.open(PlayerNewsModalComponent, {size: 'lg', windowClass: `lineups-custom-modal common-modal` });
    modalRef.componentInstance.data = {
      league: this.currentLeague,
      players,
      selectedPlayerId: id
    };
  }

  private getDDdata(playersData) {
    let teams;
    if (this.currentLeague !== 'cfb') {
      const leagueTeams = this.playersPageService.getTeamDropdown(this.currentLeague);
      teams = playersData.team_dropdown.map((ddTeam) => {
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
    } else {
      teams = this.commonService.prepareDDItems(playersData.team_dropdown, true);
    }
    return {
      teams: teams,
      positions: this.commonService.prepareDDItems(playersData.position_dropdown, true)
    };
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
            // tslint:disable-next-line:max-line-length
            this.ddData.positions && this.ddData.positions.filter(o => o.selected).length === this.playersData.position_dropdown.length ? null : this.ddData.positions,
            // this.ddData.seasons
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
          if (this.currentLeague === 'nba') {
            this.setNbaSchema();
          }
          if (this.currentLeague === 'nfl') {
            this.setNflSchema();
          }
          if (this.currentLeague === 'mlb') {
            this.setMlbSchema();
          }
          if (this.currentLeague === 'cfb') {
            this.playersData.results = this.playersData.results.map(player => {
              player.team = player.team_full_name;
              player.full_name = player.first_name + ' ' + player.last_name;
              return player;
            });
          }
          if (args.getDefaultData) {
            this.introParagraph = playersData.intro_paragraph;
            this.bottomHeader = playersData.bottom_paragraph;
            this.bottomParagraph = playersData.bottom_header;
            this.title.setTitle(playersData.page_title);
            this.ddData = this.getDDdata(playersData);
          }
          if (args.updatePagination) {
            this.totalItems = playersData.count;
          }
        }
      });
  }


  filterByName(filterVal) {
    this.searchPlayerVal = filterVal;
    this.filterItems(true);
  }
}
