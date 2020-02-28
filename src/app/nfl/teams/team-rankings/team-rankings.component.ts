import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SortingService } from '../../../shared/services/sorting.service';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { CommonService } from '../../../shared/services/common.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { NflService } from '../../nfl.service';
import { TeamService } from '../team.service';
import { TitleService } from '../../../shared/services/title.service';
import { TeamRankingsService } from './team-rankings.service';
import { SchemaService } from '../../../shared/services/schema.service';

@Component({
  selector: 'app-team-rankings',
  templateUrl: './team-rankings.component.html',
  styleUrls: ['./team-rankings.component.scss']
})
export class TeamRankingsComponent implements OnInit, OnDestroy {
  searchModel: string;
  teamRankingsData;
  seasons;
  ddData;
  dropdownCollapsed;
  pageHeading: string;
  params: {year?: string, type?: 'defense' | 'special-teams'};
  currentPage;
  itemsPerPage;
  sortBy;
  sortOrder;
  csvShowed: boolean;
  selectedSortName: string;
  sortFunctions: any;

  ratingConfig: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private teamService: TeamService,
    private nflService: NflService,
    private dropdownService: DropdownService,
    private commonService: CommonService,
    private spinnerService: SpinnerService,
    private title: TitleService,
    private breadcrumbService: BreadcrumbService,
    private teamRankingsService: TeamRankingsService,
    private sortingService: SortingService,
    private schemaService: SchemaService
  ) { }

  ngOnInit() {
    this.ratingConfig = this.teamRankingsService.ratingConfig;
    this.route.params.subscribe((params: Params) => {
      this.spinnerService.hideSpinner();
      this.teamRankingsData = this.route.snapshot.data['teamRankingsData'];
      this.seasons = this.teamRankingsData.seasons_dropdown;

      this.params = {
        year: this.nflService.getPreSelectedLeagueSeason() ||
        this.nflService.getDefaultSeason(this.seasons),
        type: params.type
      };

      this.spinnerService.hideSpinner();
      this.teamRankingsData.column_headers = this.teamRankingsService.getColumnHeaders(this.params.type);
      this.teamRankingsData.header_map = this.teamRankingsService.getColumnHeaderMap();
      this.handleApiResponse(this.teamRankingsData);

      const savedDDs = this.teamService.getSavedDD(true);
      if (savedDDs && savedDDs.conferenceDropdown && savedDDs.conferenceDropdown.length) {
        this.ddData = savedDDs;
        const rankingsType = this.teamService.generateRankingsTypeDD(this.params.type);
        this.ddData.rankingsType = rankingsType.rankingsType;
        this.ddData.activeRankingsType = rankingsType.activeRankingsType;
        this.onDdChange(false);
      } else {
        this.ddData = this.teamService.generateTeamRankingsDdObject(
          this.teamRankingsData.division_dropdown,
          this.teamRankingsData.conference_dropdown,
          this.params.type
        );
      }

      this.ddData.seasons = this.seasons.map(season => {
        return {
          ...season,
          name: this.nflService.handleYear(season.year)
        }
      });

      this.searchModel = '';
      this.currentPage = 0;
      this.dropdownCollapsed = true;

      this.sortFunctions = {};
      this.teamRankingsData.column_headers.forEach(header => {
        switch (header) {
          case 'team': {
            return this.sortFunctions[header] = 'nav.team_name_full';
          }
          default: {
            return this.sortFunctions[header] = this.customSort.bind(this, header);
          }
        }
      });
      switch (this.params.type) {
        case 'special-teams': {
          this.sortBy = this.sortFunctions['overall_rating_rank'];
          break;
        }
        case 'defense': {
          this.sortBy = this.sortFunctions['defensive_rating_rank'];
          break;
        }
        default: {
          this.sortBy = this.sortFunctions['offensive_rating_rank'];
          break;
        }
      }
      this.sortOrder = 'asc';
    });
  }

  ngOnDestroy() {
    this.spinnerService.hideSpinner();
  }

  onYearDdChange(season) {
    if (this.params.year === season.year) {
      return;
    }
    this.nflService.setPreSelectedLeagueSeason(season.year);
    this.params.year = season.year;
    this.onDdChange(true);
  }

  handleApiResponse(res) {
    this.teamRankingsData.data = res.data;
    this.teamRankingsData.heading = res.heading;
    this.teamRankingsData.page_title = res.page_title;
    this.teamRankingsData.intro_paragraph = res.intro_paragraph;
    this.teamRankingsData.bottom_paragraph = res.bottom_paragraph;
    this.teamRankingsData.bottom_header = res.bottom_header;
    this.pageHeading = this.teamRankingsData.heading;
    const breadcrumbs = [
      {
        label: 'NFL',
        url: '/nfl'
      },
      {
        label: this.pageHeading,
        url: './'
      }
    ];

    this.setSchema();
    this.breadcrumbService.changeBreadcrumbs(breadcrumbs);

    this.title.setTitle(this.teamRankingsData.page_title);
  }

  onColorTabsClick(tab) {
    if (tab) {
      this.ddData.colorTabs.forEach(item => {
        item.selected = item.name === tab.name;
      });
    }
    this.ddData.activeColorTab =  this.commonService.getActiveCheckBoxItems(this.ddData.colorTabs, 'name')[0];
  }


  onDdChange(callApi = true) {
    this.ddData.activeConference =  this.commonService.getActiveCheckBoxItems(this.ddData.conferenceDropdown, 'id')[0];
    if (this.ddData.activeConference === null) {
      this.ddData.divisionDropdown.forEach(item => {
        return item.selected = item.id === null;
      })
    }
    this.ddData.activeDivision =  this.commonService.getActiveCheckBoxItems(this.ddData.divisionDropdown, 'id')[0];
    this.saveDds();
    if (callApi) {
      this.spinnerService.handleAPICall(this.teamService.getTeamRankingsData(this.params.year, this.params.type, {
        conference: this.ddData.activeConference,
        division: this.ddData.activeDivision
      })).subscribe(res => {
        this.handleApiResponse(res);
      })
    }
  }

  onStatTypeDdChange() {
    const prevActiveRankingsType = this.ddData.activeRankingsType;
    this.ddData.activeRankingsType = this.commonService.getActiveCheckBoxItems(this.ddData.rankingsType, 'id');
    if (this.ddData.activeRankingsType === prevActiveRankingsType) {
      return;
    }
    this.spinnerService.showSpinner();
    this.saveDds();
    if (this.ddData.activeRankingsType === null) {
      return this.router.navigate(['/nfl-team-rankings']);
    }
    return this.router.navigate([`/nfl-team-rankings/${this.ddData.activeRankingsType}`]);
  }

  onSortBy($event) {
    this.sortBy = $event;
    this.selectedSortName = null;
  }

  onSortOrder($event) {
    this.sortOrder = $event;
  }

  customSort(sortBy, row) {
    return this.sortingService.customSort(sortBy, row, (value) => {
      if (typeof value === 'string' && value.indexOf(',') !== -1) {
        return parseFloat(value.replace(/,/g, ''));
      }
      return parseFloat(value) || 0;
    });
  }

  private saveDds() {
    this.teamService.saveDD({
      conferenceDropdown: this.ddData.conferenceDropdown,
      divisionDropdown: this.ddData.divisionDropdown,
      activeColorTab: this.ddData.activeColorTab,
      seasons: this.ddData.seasons,
      colorTabs: this.ddData.colorTabs
    }, true);
  }

  private setSchema() {
    const teamsSchema = this.teamRankingsData.data.map(team => {
      return {
        '@context': 'http://schema.org',
        '@type': 'SportsTeam',
        'name': team.nav.team_name_full,
        'sport': 'American Football',

        'url': `https://www.lineups.com${team.nav.team_depth_chart_route}`,

        'memberOf': [
          {
            '@type': 'SportsOrganization',
            'name': 'NFL'
          }
        ]
      }
    });
    if (this.params.type === 'defense') {
      this.schemaService.addSchema([this.commonService.generateDatasetSchema(
        'NFL Defense Team Rankings',
        // tslint:disable-next-line:max-line-length
        'Defense team rankings for all 32 NFL teams. Statistical ranking categories include, overall defense, Fantasy Points, Plays, Points, Yards, Pass Yards, Pass Attempts, Pass Completions, Pass TDs, Rush Yards, Rush TD, TD, Redzone TD, Redzone TD %, 1st downs, 3rd down conversion %, 4th down conversion %, Interceptions, Sacks.',
        'defense team rankings, nfl defense team rankings, nfl defense rankings',
        'https://www.lineups.com/nfl-team-rankings/defense',
        'Dataset'
      ), ...teamsSchema]);
    } else if (this.params.type === 'special-teams') {
      this.schemaService.addSchema([this.commonService.generateDatasetSchema(
        'NFL Special Teams Rankings',
        // tslint:disable-next-line:max-line-length
        'Special Teams rankings for all 32 NFL teams. Statistical ranking categories include, overall, FG%, field goal attempts, field goals made, extra point attempts, extra points made, opponent field goal attempts, opponent field goal made, opponent extra points made, opponent extra points attempted, Opponent punts, opponent punt return yards, opponent kick return yards, punt returns, kick returns, punt average, punt net average.',
        'nfl special teams rankings, special teams rankings',
        'https://www.lineups.com/nfl-team-rankings/special-teams',
        'Dataset'
      ), ...teamsSchema]);
    } else {
      this.schemaService.addSchema([this.commonService.generateDatasetSchema(
        'NFL Offense Team Rankings',
        // tslint:disable-next-line:max-line-length
        'Offense team rankings for all 32 NFL teams. Statistical ranking categories include, overall offense, Fantasy Points, Plays, Points, Yards, Pass Yards, Pass Attempts, Pass Completions, Pass TDs, Rush Yards, Rush TD, TD, Redzone TD, Redzone TD %, 1st downs, 3rd down conversion %, 4th down conversion %, Interceptions, Sacks.',
        'nfl team rankings, nfl offense team rankings, nfl rankings',
        'https://www.lineups.com/nfl-team-rankings',
        'Dataset'
      ), ...teamsSchema]);
    }
  }
}
