import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SortingService } from '../../../shared/services/sorting.service';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { CommonService } from '../../../shared/services/common.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { TitleService } from '../../../shared/services/title.service';
import { SchemaService } from '../../../shared/services/schema.service';
import * as _ from 'lodash';
import { TeamStatsService } from '../team-stats.service';
import { NbaService } from '../../nba.service';

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
  params: {year?: string, type: string, pageType: string};
  sortBy;
  sortOrder;
  selectedSortName: string;
  sortFunctions: any;
  rankingsConfig;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private teamStatsService: TeamStatsService,
    private nbaService: NbaService,
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
        year: this.nbaService.getPreSelectedLeagueSeason() ||
        this.nbaService.getDefaultSeason(this.seasons),
        type: this.route.snapshot.data['type'],
        pageType: this.route.snapshot.data['pageType']
      };
      this.rankingsConfig = this.teamStatsService.rankingsConfig;

      this.spinnerService.hideSpinner();

      const savedDDs = this.teamStatsService.getSavedDD();
      if (savedDDs && savedDDs.conferenceDropdown && savedDDs.conferenceDropdown.length) {
        this.ddData = savedDDs;
        const statsType = this.teamStatsService.generateStatsTypeDD(this.params.type, this.params.pageType);
        this.ddData.statsType = statsType.statsType;
        this.ddData.activeStatsType = statsType.activeStatsType;
        this.onDdChange(false);
      } else {
        this.ddData = this.teamStatsService.generateTeamStatsDdObject(
          this.params.type,
          this.params.pageType
        );
      }


      this.ddData.seasons = this.teamStatsData.seasons_dropdown.map(season => {
        return {
          ...season,
          name: this.nbaService.handleYear(season.year)
        }
      });


      this.searchModel = '';
      this.dropdownCollapsed = true;

      this.handleApiResponse(this.route.snapshot.data['teamStatsData']);

      const sortBy = this.teamStatsService.getSortBy();
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
        this.teamStatsService.removeSortBy();
      } else {
        if (this.params.pageType !== 'rankings') {
          if (this.params.type === 'offense') {
            this.sortBy = this.sortFunctions['Points'];
            this.sortOrder = 'desc';
          } else {
            this.sortBy = this.sortFunctions['Opponent_Points'];
            this.sortOrder = 'asc';
          }
        } else {
          if (this.params.type === 'offense') {
            this.sortBy = this.sortFunctions['Wins'];
            this.sortOrder = 'asc';
          } else {
            this.sortBy = this.sortFunctions['Opponent_Points'];
            this.sortOrder = 'asc';
          }
        }
      }
    });
  }

  handleApiResponse(data) {
    this.teamStatsData['header_map'] = this.getHeaderMap(this.params.type, this.params.pageType);
    this.teamStatsData.data = this.teamStatsData.data.map(item => {
      item.team_info = this.nbaService.getTeamByKey(item['Team']);
      if (this.params.type === 'offense' && this.params.pageType === 'rankings') {
        try {
          const winsLosses = item.nav.team_record.split('-');
            item.wins = winsLosses[0];
            item.losses = winsLosses[1];
        } catch (e) {
          console.error('error', e);
        }
      }
      return item;
    });
    this.teamStatsData.column_headers = this.getColumnHeaders(this.params.type, this.params.pageType);
    this.pageHeading = this.teamStatsData.heading;
    const breadcrumbs = [
      {
        label: 'NBA',
        url: '/nba'
      },
      {
        label: 'Teams',
        url: '/nba/teams'
      }
    ];

    if (this.params.pageType === 'rankings') {
      breadcrumbs.push(
        {
          label: 'NBA Team Rankings',
          url: '/nba/team-rankings'
        },
      );
      if (this.params.type === 'defense') {
        breadcrumbs.push(
          {
            label: this.pageHeading,
            url: `/nba/team-rankings/${this.params.type}`
          },
        );
      }
    } else {
      breadcrumbs.push(
        {
          label: 'NBA Team Stats',
          url: '/nba/team-stats'
        },
        {
          label: this.pageHeading,
          url: `/nba/team-stats/${this.params.type}`
        },
      );
    }

    this.setDatasetSchema();
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
    this.nbaService.setPreSelectedLeagueSeason(season.year);
    this.params.year = season.year;
    this.onDdChange(true);
  }

  onDdChange(callApi = true) {
    this.ddData.activeConference =  this.commonService.getActiveCheckBoxItems(this.ddData.conferenceDropdown, 'id')[0];
    if (this.params.pageType !== 'rankings') {
      this.ddData.activeMode =  this.commonService.getActiveCheckBoxItems(this.ddData.modeDropdown, 'id')[0];
      this.teamStatsService.saveDD({
        conferenceDropdown: this.ddData.conferenceDropdown,
        modeDropdown: this.ddData.modeDropdown
      });
    } else {
      this.teamStatsService.saveDD({
        conferenceDropdown: this.ddData.conferenceDropdown,
      });
    }
    if (callApi) {
      const queryParams: any = {
        conference: this.ddData.activeConference,
      };
      if (this.params.pageType !== 'rankings') {
        queryParams.mode = this.ddData.activeMode;
      }
      this.spinnerService.handleAPICall(this.teamStatsService.getTeamStatsData(
        this.params.year, this.params.type, queryParams, this.params.pageType
      ))
        .subscribe(res => {
          this.teamStatsData.data = res.data;
          this.teamStatsData.heading = res.heading;
          this.teamStatsData.page_title = res.page_title;
          this.teamStatsData.intro_paragraph = res.intro_paragraph;
          this.handleApiResponse(res);
        });
    }
  }

  onStatTypeDdChange() {
    const prevActiveStatsType = this.ddData.activeStatsType;
    this.ddData.activeStatsType = this.commonService.getActiveCheckBoxItems(this.ddData.statsType, 'id')[0];
    if (this.ddData.activeStatsType === prevActiveStatsType) {
      return;
    }
    this.spinnerService.showSpinner();
    if (this.params.pageType !== 'rankings') {
      if (this.ddData.activeStatsType === null) {
        return this.router.navigate(['/nba/team-stats']);
      }
      return this.router.navigate([`/nba/team-stats/${this.ddData.activeStatsType}`]);
    } else {
      if (this.ddData.activeStatsType === 'offense') {
        return this.router.navigate(['/nba/team-rankings']);
      }
      return this.router.navigate([`/nba/team-rankings/${this.ddData.activeStatsType}`]);
    }
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

  showReverseColors() {
    return false;
  }

  private setDatasetSchema() {
    let dataSetSchema;
    if (this.params.pageType === 'rankings') {
      if (this.params.type === this.teamStatsService.availableTeamStats[0]) {
        dataSetSchema = this.commonService.generateDatasetSchema(
          'NBA Team Rankings on Offense',
          // tslint:disable-next-line:max-line-length
          'Offense team rankings for all 30 NBA teams. Statistical ranking categories including, points, rebounds, assists, 3 point field goals and more. Ability to sort based on conference and team.',
          'nba team rankings, nba offense team rankings, nba offensive rankings',
          'https://www.lineups.com/nba/team-rankings',
          'Dataset'
        );
      } else {
        dataSetSchema = this.commonService.generateDatasetSchema(
          'NBA Team Rankings (Defense)',
          // tslint:disable-next-line:max-line-length
          'Defense team rankings for all 30 NBA teams. Statistical ranking categories including, points allowed, rebounds allowed, assists allowed, 3 point field goals allowed and more. Ability to sort based on conference and team.',
          'nba team rankings, nba defense team rankings, nba defense rankings',
          'https://www.lineups.com/nba/team-rankings/defense',
          'Dataset'
        );
      }
    } else {
      if (this.params.type === this.teamStatsService.availableTeamStats[0]) {
        dataSetSchema = this.commonService.generateDatasetSchema(
          'NBA Team Stats (offense)',
          // tslint:disable-next-line:max-line-length
          'NBA Team offense stats for 30 teams. NBA offensive team stats, total offense, rebounding, passing offense and shooting stats for each team. Sort by division and team.',
          'nba team offense stats, nba team total offense, nba team passing offense, nba team rebounding offense, nba team 3pt stats.',
          'https://www.lineups.com/nba/team-stats/offense',
          'Dataset'
        );
      } else {
        dataSetSchema = this.commonService.generateDatasetSchema(
          'NBA Team Stats (defense)',
          // tslint:disable-next-line:max-line-length
          'NBA Team defense stats for 30 teams. NBA defensive team stats, total offense allowed, rebounding allowed, passing offense allowed and shooting stats allowed for each team. Sort by division and team.',
          // tslint:disable-next-line:max-line-length
          'nba team defense stats, nba team total defense, nba team passing offense allowed, nba team rebounding offense allowed, nba team 3pt stats allowed.',
          'https://www.lineups.com/nba/team-stats/defense',
          'Dataset'
        );
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
        'sport': 'Basketball',

        'memberOf': [
          {
            '@type': 'SportsOrganization',
            'name': 'NBA'
          }
        ]
      }
    })
  }

  private getColumnHeaders(type, pageType) {
    if (pageType === 'rankings') {
      return (type === 'offense' ?
        this.teamStatsService.columnHeaders.teamRankings.offense : this.teamStatsService.columnHeaders.teamRankings.defense)
    }
    return (type === 'offense' ?
      this.teamStatsService.columnHeaders.teamStats.offense : this.teamStatsService.columnHeaders.teamStats.defense)
  }

  private getHeaderMap(type, pageType) {
    if (pageType === 'rankings') {
      return (type === 'offense' ?
        this.teamStatsService.headerMap.teamRankings.offense : this.teamStatsService.headerMap.teamRankings.defense)
    }
    return (type === 'offense' ?
      this.teamStatsService.headerMap.teamStats.offense : this.teamStatsService.headerMap.teamStats.defense)
  }
}
