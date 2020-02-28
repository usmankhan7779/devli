
import {debounceTime} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StatsService } from './stats.service';
import { DropdownService } from '../../shared/components/dropdown/dropdown.service';
import { NflService } from '../nfl.service';
import { Subject } from 'rxjs';
import { CommonService } from '../../shared/services/common.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { ShowPercentagePipe } from '../../shared/pipes/show-percentage.pipe';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TargetsService } from '../targets-gateway/targets.service';
import * as _ from 'lodash';
import { SortingService } from '../../shared/services/sorting.service';
import { TitleService } from '../../shared/services/title.service';
import { SchemaService } from '../../shared/services/schema.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  providers: [ShowPercentagePipe]
})
export class StatsComponent implements OnInit, OnDestroy {
  isDefaultYear: boolean;
  searchModel: string;
  statsData;
  seasons;
  players;
  ddData;
  dropdownCollapsed;
  pageHeading: string;
  params: {year?: string, type: string};
  totalItems;
  currentPage;
  itemsPerPage;
  sortBy;
  sortOrder;
  csvShowed: boolean;
  searchTerm$ = new Subject<string>();
  csvText: string;
  snapsMainRadio: any[];
  snapsSecondaryRadio: any[];
  selectedSortName: string;
  sortFunctions: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private statsService: StatsService,
    private nflService: NflService,
    private targetsService: TargetsService,
    private dropdownService: DropdownService,
    private commonService: CommonService,
    private spinnerService: SpinnerService,
    private title: TitleService,
    private showPercentagePipe: ShowPercentagePipe,
    private breadcrumbService: BreadcrumbService,
    private sortingService: SortingService,
    private schemaService: SchemaService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.snapsMainRadio = this.targetsService.snapsMainRadio;
      this.snapsSecondaryRadio = this.targetsService.snapsSecondaryRadio;
      this.snapsSecondaryRadio.push(
        {
          'name': 'K',
          'stats': ['player-stats', 'kicker-stats']
        }
      );

      this.searchModel = '';
      this.spinnerService.hideSpinner();
      this.currentPage = 0;
      this.csvShowed = false;
      this.dropdownCollapsed = true;

      this.params = {
        year: this.nflService.getPreSelectedLeagueSeason() ||
        this.nflService.getDefaultSeason(this.route.snapshot.data['statsData'].data.seasons_dropdown),
        type: params.type
      };
      this.handleResponse(this.route.snapshot.data['statsData'].data);
    });
    this.initFilter();
  }

  ngOnDestroy() {
    this.searchTerm$.unsubscribe();
    this.spinnerService.hideSpinner();
  }


  onYearDdChange(season) {
    if (this.params.year === season.year) {
      return;
    }
    this.nflService.setPreSelectedLeagueSeason(season.year);
    this.params.year = season.year;
    this.totalItems = null;
    this.spinnerService.handleAPICall(this.statsService.getStats(this.params.year, this.params.type))
      .subscribe(res => {
        this.handleResponse(res);
      });
  }

  private handleResponse(res) {
    this.seasons = res.seasons_dropdown;
    this.isDefaultYear = this.nflService.checkIfDefaultSeason(this.params.year, this.seasons);
    this.pageHeading = res.heading || this.statsService.getPageHeading(this.params.type);

    const breadcrumbs = [
      { label: 'NFL', url: '/nfl' },
      { label: 'Players', url: '/nfl/players' }
    ];

    if (!this.isDefaultYear) {
      breadcrumbs.push({
        label: this.params.year,
        url: '/nfl/schedule/' + this.params.year
      });
    }

    breadcrumbs.push(
      {
        label: 'NFL Player Stats',
        url: `/nfl/player-stats`
      },
      {
        label: this.pageHeading,
        url: `/nfl/player-stats/${this.params.type}`
      },
    );

    this.breadcrumbService.changeBreadcrumbs(breadcrumbs);

    this.statsData = res;

    this.players = this.statsData.data.slice();

    this.title.setTitle(res.page_title || this.pageHeading);
    this.ddData = this.statsService.getDddObj(this.statsData.player_type, this.params.type, this.statsData.type_dropdown);

    this.totalItems = this.statsData.data.length;

    this.ddData.seasons = this.seasons.map(season => {
      return {
        ...season,
        name: this.nflService.handleYear(season.year)
      }
    });

    const savedDDs = this.targetsService.getSavedDD();
    const savedStatsDD = this.targetsService.getSavedDD('savedStatsDD');
    if (savedStatsDD && savedStatsDD.main && savedStatsDD.secondary) {
      const savedMain: any = _.find(savedStatsDD.main, 'selected');
      if (savedMain) {
        const selectedMain: any = _.find(this.ddData.main, {prop: savedMain.prop});
        if (selectedMain) {
          this.ddData.main.forEach(item => {
            item.selected = selectedMain.prop === item.prop;
          });
        }
      }
      const savedSecondary: any = _.find(savedStatsDD.secondary, 'selected');
      if (savedSecondary) {
        const selectedSecondary: any = _.find(this.ddData.secondary, {prop: savedSecondary.prop});
        if (selectedSecondary) {
          this.ddData.secondary.forEach(item => {
            item.selected = selectedSecondary.prop === item.prop;
          });
        }
      }
      this.onDropdownChange();
    }
    if (savedDDs && savedDDs.teams && savedDDs.teams.length) {
      this.ddData.teams = savedDDs.teams;
      this.onTeamDropdownChange();
    } else {
      this.ddData.teams = this.commonService.prepareDDItems(this.statsData.teams_dropdown, true, true, false, true);
    }

    const sortBy = this.statsService.getSortBy(this.params.type);
    this.sortFunctions = {};
    this.statsData[this.ddData.activeMain + '_order'].forEach(header => {
      const prop = this.ddData.activeMain + '_stats' + '.' + this.ddData.activeSecondary + '.' + header;
      return this.sortFunctions[prop] = this.customSort.bind(this, prop);
    });
    if (sortBy) {
      this.sortBy = this.sortFunctions[`${this.ddData.activeMain}_stats.${this.ddData.activeSecondary}.${sortBy}`];
      this.sortOrder = 'desc';
      this.selectedSortName = sortBy;
      this.statsService.removeSortBy();
    }
    this.updateCSVText();
    this.setSchema();
  }


  onTeamDropdownChange() {
    this.ddData.activeTeams = this.commonService.getActiveCheckBoxItems(this.ddData.teams, 'name');
    this.targetsService.saveDD({
      teams: this.ddData.teams
    });
    if (this.ddData.activeTeams.length === 0) {
      this.ddData.activeTeams = ['null'];
    }
    if (this.ddData.activeTeams.length === this.ddData.teams.length) {
      this.ddData.activeTeams = [];
    }
    this.searchTerm$.next();
  }

  onDropdownChange(page?, isTabSelected?) {
    if (isTabSelected) {
     return this.navigateTab(this.commonService.getActiveCheckBoxItems(this.ddData.tabs, 'prop')[0]);
    }
    if (page) {
      this.currentPage = page;
    }
    this.searchModel = '';
    this.players = this.statsData.data.slice();
    this.ddData.activeMain = this.commonService.getActiveCheckBoxItems(this.ddData.main, 'prop')[0];
    this.ddData.activeSecondary =  this.commonService.getActiveCheckBoxItems(this.ddData.secondary, 'prop')[0];
    this.ddData.itemsPerPage =  this.commonService.getActiveCheckBoxItems(this.ddData['items_per_page'], 'name')[0];

    this.sortFunctions = {};
    this.statsData[this.ddData.activeMain + '_order'].forEach(header => {
      const prop = this.ddData.activeMain + '_stats' + '.' + this.ddData.activeSecondary + '.' + header;
      return this.sortFunctions[prop] = this.customSort.bind(this, prop);
    });
    if (this.selectedSortName) {
      this.sortBy = this.sortFunctions[`${this.ddData.activeMain}_stats.${this.ddData.activeSecondary}.${this.selectedSortName}`];
    }
    this.players = this.players.slice(0);

    this.targetsService.saveDD({
      main: this.ddData.main,
      secondary: this.ddData.secondary
    }, 'savedStatsDD');
    this.updateCSVText();
    return;
  }

  onSortBy($event) {
    this.selectedSortName = '';
    this.sortBy = $event;
  }

  onSortOrder($event) {
    this.sortOrder = $event;
  }

  onCsvShow() {
    this.csvShowed = !this.csvShowed;
  }

  onButtonGroupClick(isSelected) {
    if (isSelected) {
      return;
    }
    this.spinnerService.showSpinner();
  }

  filterByName(filterVal) {
    this.searchModel = filterVal;
    this.searchTerm$.next();
  }

  isMainRadioDisabled(radio) {
    const activeTab: any = _.find(this.snapsSecondaryRadio, {
      'name': this.statsService.getAvailableStatsTypes()[this.params.type]
    });
    for (const key in activeTab) {
      if (key === radio.value) {
        return false;
      }
    }
    return true;
  }

  onSnapCountMainTabClick(activeTab) {
    console.log(activeTab);
    if (activeTab.value === 'stats') {
      return;
    }
    let activeSecondaryTab: any;
    if (this.isMainRadioDisabled(activeTab)) {
      activeSecondaryTab = _.find(this.snapsSecondaryRadio, activeTab.value);
    } else {
      activeSecondaryTab = _.find(this.snapsSecondaryRadio, {
        'name': this.statsService.getAvailableStatsTypes()[this.params.type]
      });
    }
    let navVal;
    if (Array.isArray(activeSecondaryTab[activeTab.value])) {
      navVal = activeSecondaryTab[activeTab.value];
    } else {
      navVal = [activeSecondaryTab[activeTab.value]];
    }
    this.router.navigate(['/nfl', ...navVal]);
  }

  customSort(sortBy, row) {
    return this.sortingService.customSort(sortBy, row, (value) => {
      if (typeof value === 'string' && value.indexOf(',') !== -1) {
        return parseFloat(value.replace(/,/g, ''));
      }
      return parseFloat(value) || 0;
    });
  }

  private generateUrlForSeasonsDd(type) {
    return `/nfl/player-stats/${type}`;
  }

  private updateCSVText() {
    this.csvText = this.commonService.generateCSV(this.csvFormatPlayers(this.players));
  }

  private csvFormatPlayers(players: any) {
    return players.map((obj) => {
      const resObj = {};
      resObj['NAME'] = obj.name;
      resObj['RTG'] = obj.lineups_rating;
      resObj['TEAM'] = obj.team;
      for (const header of this.statsData[this.ddData.activeMain + '_order']) {
        try {
          resObj[this.statsData.header_map[header]] =
            this.showPercentagePipe.transform(obj[this.ddData.activeMain + '_stats'][this.ddData.activeSecondary][header], header);
        } catch (err) {
          resObj[this.statsData.header_map[header]] = '';
        }
      }
      return resObj;
    });
  }

  private initFilter() {
    this.searchTerm$.pipe(
      debounceTime(500))
      .subscribe(() => {
        let dataToFilter = this.statsData.data.slice(0);
        dataToFilter = dataToFilter.filter((item) => {
          return (!this.searchModel || (item.name.toLowerCase().indexOf(this.searchModel.toLowerCase()) !== -1)) &&
            ((!this.ddData.activeTeams || !this.ddData.activeTeams.length) || (_.includes(this.ddData.activeTeams, item.team)));
        });
        this.players = dataToFilter;
      });
  }

  private navigateTab(tabProp) {
    this.searchModel = '';
    this.spinnerService.showSpinner();
    if (tabProp === 'player-stats') {
      return this.router.navigate([`/nfl/${tabProp}`]);
    }
    this.router.navigate([
        this.generateUrlForSeasonsDd(tabProp)
    ]);
  }

  private setSchema() {
    let dataset: any;
    switch (this.params.type) {
      case 'quarterback-qb-stats': {
        dataset = this.commonService.generateDatasetSchema(
          'Quarterback Stats',
          // tslint:disable-next-line:max-line-length
          'NFL quarterback stats over last 3 games, last 5 games and for the season.  Stats include player name, player rating, team, games played, completions, attempts, attempts per game, yards, games with over 300 yards passing, completion percentage, yards per attempt, yards per completion, TD, INT, quarterback rating, longest pass, sacks, sack yards lost, fumbles lost.',
          'Quarterback stats, NFL quarterback stats, QB stats',
          'https://www.lineups.com/nfl/player-stats/quarterback-qb-stats',
          'Dataset'
        );
        break;
      }
      case 'runningback-rb-stats': {
        dataset = this.commonService.generateDatasetSchema(
          'Running Back Stats',
          // tslint:disable-next-line:max-line-length
          'NFL running back stats over last 3 games, last 5 games and for the season.  Stats include player name, player rating, team, games played, completions, attempts, attempts per game, yards, yards per attempt, games with 100 yards rushing, TD, longest run, fumbles, fumbles lost.',
          'Running back stats, NFL Running back stats, RB stats',
          'https://www.lineups.com/nfl/player-stats/runningback-rb-stats',
          'Dataset'
        );
        break;
      }
      case 'wide-receiver-wr-stats': {
        dataset = this.commonService.generateDatasetSchema(
          'Wide Receiver Stats',
          // tslint:disable-next-line:max-line-length
          'NFL wide receiver stats over last 3 games, last 5 games and for the season.  Stats include player name, player rating, team, games played, targets, receptions, targets per game, yards, 100 yard receiving games, yards per reception, TD, longest catch, fumbles, fumbles lost.',
          'wide receiver stats, NFL wide receiver stats, WR stats',
          'https://www.lineups.com/nfl/player-stats/wide-receiver-wr-stats',
          'Dataset'
        );
        break;
      }
      case 'tight-end-te-stats': {
        dataset = this.commonService.generateDatasetSchema(
          'Tight End Stats',
          // tslint:disable-next-line:max-line-length
          'NFL tight end stats over last 3 games, last 5 games and for the season.  Stats include player name, player rating, team, games played, targets, receptions, targets per game, yards, 100 yard receiving games, yards per reception, TD, longest catch, fumbles, fumbles lost.',
          'tight end stats, NFL tight end stats, TE stats',
          'https://www.lineups.com/nfl/player-stats/tight-end-te-stats',
          'Dataset'
        );
        break;
      }
      case 'defensive-players-stats': {
        dataset = this.commonService.generateDatasetSchema(
          'Defensive Player Stats',
          // tslint:disable-next-line:max-line-length
          'NFL defensive player stats over last 3 games, last 5 games and for the season.  Stats include player name, player rating, team, games played, tackles, solo tackles, assisted tackles, tackle for loss, sacks, sack yards, quarterback hits, pass defensed, forced fumbles, fumble recovery, fumble recovery td, INT, INT yards, INT TD',
          'Defensive Player Stats, IDP stats, defense  players stats',
          'https://www.lineups.com/nfl/player-stats/defensive-players-stats',
          'Dataset'
        );
        break;
      }
      case 'kicker-stats': {
        dataset = this.commonService.generateDatasetSchema(
          'Kicker Stats',
          // tslint:disable-next-line:max-line-length
          'NFL kicker stats over last 3 games, last 5 games and for the season.  Stats include player name, player rating, team, games played, field goals made, field goals attempted, Long made, extra points made, extra points attempted, field goals made 0-19 yards, field goals made 20-29 yards, field goals made 30-39 yards, field goals made 40-49 yards, field goals made 50+ yards, points, field goals attempted per game, field goal percentage, extra point percentage.',
          'Kicker stats, field goal kicker stats, FG stats',
          'https://www.lineups.com/nfl/player-stats/kicker-stats',
          'Dataset'
        );
        break;
      }
    }
    if (dataset) {
      if (this.selectedSortName) {
        dataset = [dataset, ...this.generatePlayersSchema()]
      }
      this.schemaService.addSchema(dataset);
    }
  }

  private generatePlayersSchema() {
    return _.orderBy(this.players, this.sortBy, [this.sortOrder])
      .slice(0, 50)
      .map((player: any) => {
        return {
          '@context': 'http://schema.org',

          '@type': 'Person',

          'name': player.name,

          'url': 'https://www.lineups.com' + player.profile_url,

          'jobTitle': player.position,

          'memberOf': [
            {
              '@type': 'SportsTeam',
              'name': player.team,
              'sport': 'American Football',
              'memberOf': [
                {
                  '@type': 'SportsOrganization',
                  'name': 'NFL'
                }
              ]
            }
          ]
        }
    });
  }

}
