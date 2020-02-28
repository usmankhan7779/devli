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
import { SchemaService } from '../../../shared/services/schema.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.scss'],
})
export class TeamStatsComponent implements OnInit, OnDestroy {
  searchModel: string;
  teamStatsData;
  seasons;
  ddData;
  dropdownCollapsed;
  pageHeading: string;
  params: {year?: string, type: string};
  sortBy;
  sortOrder;
  selectedSortName: string;
  sortFunctions: any;
  sumTableSize: number[];

  readonly tableSizeArr = {
    'offense': [
      {
        colLength: 9,
        name: 'Total Offense'
      },
      {
        colLength: 4,
        name: 'Rushing Offense'
      },
      {
        colLength: 6,
        name: 'Passing Offense'
      },
      {
        colLength: 3,
        name: 'Redzone'
      },
      {
        colLength: 3,
        name: 'Turnovers'
      },
      {
        colLength: 2,
        name: 'Penalties'
      }
    ],
    'defense': [
      {
        colLength: 9,
        name: 'Total Offense Allowed'
      },
      {
        colLength: 4,
        name: 'Rushing Allowed'
      },
      {
        colLength: 6,
        name: 'Passing Allowed'
      },
      {
        colLength: 3,
        name: 'Redzone Allowed'
      },
      {
        colLength: 3,
        name: 'Opp Turnovers'
      },
      {
        colLength: 2,
        name: 'Opp Penalties'
      }
    ],
    'special-teams': [
      {
        colLength: 11,
        name: 'Special Teams'
      },
      {
        colLength: 8,
        name: 'Special Teams Allowed'
      }
    ]
  };

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
    private sortingService: SortingService,
    private schemaService: SchemaService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.spinnerService.hideSpinner();
      this.teamStatsData = this.route.snapshot.data['teamStatsData'];
      this.seasons = this.teamStatsData.seasons_dropdown;
      this.params = {
        year: this.nflService.getPreSelectedLeagueSeason() ||
        this.nflService.getDefaultSeason(this.seasons),
        type: params.type
      };
      this.sumTableSize = this.getSums(this.tableSizeArr[this.params.type].map(item => item.colLength));

      this.spinnerService.hideSpinner();

      const savedDDs = this.teamService.getSavedDD();
      if (savedDDs && savedDDs.conferenceDropdown && savedDDs.conferenceDropdown.length) {
        this.ddData = savedDDs;
        const statsType = this.teamService.generateStatsTypeDD(this.params.type);
        this.ddData.statsType = statsType.statsType;
        this.ddData.activeStatsType = statsType.activeStatsType;
        this.onDdChange(false);
      } else {
        this.ddData = this.teamService.generateTeamStatsDdObject(
          this.teamStatsData.season_type_dropdown,
          this.teamStatsData.division_dropdown,
          this.teamStatsData.conference_dropdown,
          this.params.type
        );
      }


      this.ddData.seasons = this.teamStatsData.seasons_dropdown.map(season => {
        return {
          ...season,
          name: this.nflService.handleYear(season.year)
        }
      });


      this.searchModel = '';
      this.dropdownCollapsed = true;

      this.handleApiResponse();

      const sortBy = this.teamService.getSortBy();
      this.sortFunctions = {};
      this.teamStatsData.column_headers.forEach(header => {
        switch (header) {
          case 'team': {
            return this.sortFunctions[header] = 'team';
          }
          default: {
            return this.sortFunctions[header] = this.customSort.bind(this, header);
          }
        }
      });
      if (sortBy) {
        this.sortBy = this.sortFunctions[sortBy];
        this.sortOrder = 'desc';
        this.teamService.removeSortBy();
      }
    });
  }

  handleApiResponse() {
    this.pageHeading = this.teamStatsData.heading;
    const breadcrumbs = [
      {
        label: 'NFL',
        url: '/nfl'
      },
      {
        label: 'Teams',
        url: '/nfl/teams'
      },
      {
        label: 'NFL Team Stats',
        url: '/nfl/team-stats'
      }
    ];

    breadcrumbs.push(
      {
        label: this.pageHeading,
        url: `/nfl/team-stats/${this.params.type}`
      },
    );
    this.setDatasetSchema(this.params.type, this.pageHeading);
    this.breadcrumbService.changeBreadcrumbs(breadcrumbs);
    this.title.setTitle(this.teamStatsData.page_title);
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

  onDdChange(callApi = true) {
    this.ddData.activeConference =  this.commonService.getActiveCheckBoxItems(this.ddData.conferenceDropdown, 'id')[0];
    this.ddData.activeSeasonType =  this.commonService.getActiveCheckBoxItems(this.ddData.seasonTypeDropdown, 'id')[0];
    this.ddData.activeDivision =  this.commonService.getActiveCheckBoxItems(this.ddData.divisionDropdown, 'id')[0];
    this.teamService.saveDD({
      conferenceDropdown: this.ddData.conferenceDropdown,
      seasonTypeDropdown: this.ddData.seasonTypeDropdown,
      divisionDropdown: this.ddData.divisionDropdown
    });
    if (callApi) {
      this.spinnerService.handleAPICall(this.teamService.getTeamStatsData(this.params.year, this.params.type, {
        conference: this.ddData.activeConference,
        division: this.ddData.activeDivision,
        season_type:  this.ddData.activeSeasonType
      })).subscribe(res => {
        this.teamStatsData.data = res.data;
        this.teamStatsData.heading = res.heading;
        this.teamStatsData.page_title = res.page_title;
        this.teamStatsData.intro_paragraph = res.intro_paragraph;
        this.handleApiResponse();
      })
    }
  }

  onStatTypeDdChange() {
    const prevActiveStatsType = this.ddData.activeStatsType;
    this.ddData.activeStatsType = this.commonService.getActiveCheckBoxItems(this.ddData.statsType, 'id');
    if (this.ddData.activeStatsType === prevActiveStatsType) {
      return;
    }
    this.spinnerService.showSpinner();
    if (this.ddData.activeStatsType === null) {
      return this.router.navigate(['/nfl/team-stats']);
    }
    return this.router.navigate([`/nfl/team-stats/${this.ddData.activeStatsType}`]);
  }

  onSortBy($event) {
    this.sortBy = $event;
    this.selectedSortName = null;
  }

  onSortOrder($event) {
    this.sortOrder = $event;
  }

  showMainBorder(index) {
    return _.includes(this.sumTableSize, index + 1);
  }

  customSort(sortBy, row) {
    return this.sortingService.customSort(sortBy, row, (value) => {
      if (typeof value === 'string' && value.indexOf(',') !== -1) {
        return parseFloat(value.replace(/,/g, ''));
      }
      return parseFloat(value) || 0;
    });
  }

  private getSums(arr) {
    const result = [];
    if (!arr.length)  {
      return result;
    }
    arr.reduce(function(sum, item) {
      result.push(sum);
      return sum + item;
    });
    return result;
  }

  private setDatasetSchema(type, page_title) {
    let dataSetSchema;
    switch (type) {
      case this.teamService.availableTeamStats[0]: {
        dataSetSchema = this.commonService.generateDatasetSchema(
          'NFL Team Offense Stats',
          'NFL Team offense stats for 32 teams. ' +
          'NFL offensive team stats, total offense, rushing offense, passing offense and redzone for each team',
          'NFL Team offense stats, team total offense, team rushing offense, team passing offense, team redzone',
          'https://www.lineups.com/nfl/team-stats/offense',
          'Offensive NFL Team Stats'
        );
        break;
      }
      case this.teamService.availableTeamStats[1]: {
        dataSetSchema = this.commonService.generateDatasetSchema(
          'NFL Team Defense Stats',
          'NFL Team defense stats for 32 teams. ' +
          'NFL defensive team stats, total offense allowed, rushing offense allowed, passing offense allowed',
          'NFL Team defense stats, NFL Team defense allowed',
          'https://www.lineups.com/nfl/team-stats/defense',
          'Defensive NFL Team Stats'
        );
        break;
      }
      case this.teamService.availableTeamStats[2]: {
        dataSetSchema = this.commonService.generateDatasetSchema(
          'NFL Team special team Stats',
          'NFL Team special team stats for 32 teams. NFL special team stats and NFL special teams allowed.',
          'NFL special team stats, NFL special team allowed',
          'https://www.lineups.com/nfl/team-stats/special-teams',
          'Special Teams Stats'
        );
        break;
      }
    }
    if (dataSetSchema) {
      this.schemaService.addSchema([dataSetSchema, ...this.generateTeamSchema()]);
    }
  }

  private generateTeamSchema() {
    return this.teamStatsData.data.map((teamData) => {
      return {
        '@context': 'http://schema.org',
        '@type': 'SportsTeam',
        'name': teamData.team,
        'sport': 'American Football',

        'memberOf': [
          {
            '@type': 'SportsOrganization',
            'name': 'NFL'
          }
        ]
      }
    })
  }

}
