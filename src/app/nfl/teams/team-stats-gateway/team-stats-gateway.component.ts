import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { CommonService } from '../../../shared/services/common.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { TeamService } from '../team.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { NflService } from '../../nfl.service';
import { TitleService } from '../../../shared/services/title.service';
import { DepthChartService } from '../../depth-charts/depth-chart.service';
import { SchemaService } from '../../../shared/services/schema.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-team-stats-gateway',
  templateUrl: './team-stats-gateway.component.html',
  styleUrls: ['./team-stats-gateway.component.scss']
})
export class TeamStatsGatewayComponent implements OnInit {
  // params: {year?: string};
  data;
  ddData;
  pageTitle: string;
  dropdownCollapsed = true;

  params: {
    year: string
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private title: TitleService,
    private commonService: CommonService,
    private spinnerService: SpinnerService,
    private dropdownService: DropdownService,
    private nflService: NflService,
    private depthChartService: DepthChartService,
    private teamService: TeamService,
    private schemaService: SchemaService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {

      this.params = {
        year: this.nflService.getPreSelectedLeagueSeason() ||
        this.nflService.getDefaultSeason(this.route.snapshot.data['teamStatsData'].seasons_dropdown)
      };

      this.handleApiResponse(this.route.snapshot.data['teamStatsData']);

      const savedDDs = this.teamService.getSavedDD();
      if (savedDDs && savedDDs.conferenceDropdown && savedDDs.conferenceDropdown.length) {
        this.ddData = savedDDs;
        const statsType = this.teamService.generateStatsTypeDD(null);
        this.ddData.statsType = statsType.statsType;
        this.ddData.activeStatsType = statsType.activeStatsType;
        this.onDdChange(false);
      } else {
        this.ddData = this.teamService.generateTeamStatsDdObject(
          this.data.season_type_dropdowns,
          this.data.division_dropdown,
          this.data.conference_dropdown
        );
      }

      this.ddData.seasons = this.data.seasons_dropdown.map(season => {
        return {
          ...season,
          name: this.nflService.handleYear(season.year)
        }
      });
    });
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
      this.spinnerService.handleAPICall(this.teamService.getTeamStatsData(this.params.year, null, {
        conference: this.ddData.activeConference,
        division: this.ddData.activeDivision,
        season_type:  this.ddData.activeSeasonType
      })).subscribe(res => {
        this.handleApiResponse(res);
      })
    }
  }

  handleApiResponse(res) {
    this.data = res;
    this.pageTitle = this.data.heading;
    this.title.setTitle(this.data.page_title);

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
        url: `/nfl/team-stats`
      }
    ];

    this.setSchema();

    this.breadcrumbService.changeBreadcrumbs(breadcrumbs);
  }

  onYearDdChange(season) {
    if (this.params.year === season.year) {
      return;
    }
    this.nflService.setPreSelectedLeagueSeason(season.year);
    this.params.year = season.year;
    this.onDdChange(true);
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

  onViewMoreClick(data) {
    this.spinnerService.showSpinner();
    this.teamService.setSortBy(data.sort_stat);
    return this.router.navigate([data.stat_url]);
  }

  preselectTeamSeason() {
    this.depthChartService.setPreSelectedTeamSeason(this.params.year);
  }

  private setSchema() {
    const keys = this.data.subheadings.reduce((filtered: any[], sub: any) => {
      sub.api_keys.forEach(api_key => {
        filtered.push(api_key);
      });
      return filtered;
    }, []);
    let teams = [];
    keys.forEach(key => {
      if (this.data[key] && this.data[key].leaders) {
        teams = _.concat(teams, this.data[key].leaders)
      }
    });
    teams = _.uniq(teams);
    teams = _.uniqBy(teams, 'team_depth_chart_route');
    const teamsSchema = teams.map(team => {
      return {
        '@context': 'http://schema.org',
        '@type': 'SportsTeam',
        'name': team.team_fk__full_name,
        'sport': 'American Football',

        'url': `https://www.lineups.com${team.team_depth_chart_route}`,

        'memberOf': [
          {
            '@type': 'SportsOrganization',
            'name': 'NFL'
          }
        ]
      }
    });
    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      'Team Stats Leaders',
      // tslint:disable-next-line:max-line-length
      'Teams leading statistical categories including Offense leaders, Defense leaders, Passing leaders, rushing leaders and special teams leaders. Stats include yards, points, touchdowns, rushing attempts, field goals made, kick return average, punt return average, yards against, points against, turnovers forced.',
      'nfl team leaders, nfl team statistical leaders, nfl team stat leaders',
      'https://www.lineups.com/nfl/team-stats',
      'Dataset'
    ), ...teamsSchema]);
  }
}
