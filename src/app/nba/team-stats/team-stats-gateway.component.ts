import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';
import { CommonService } from '../../shared/services/common.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { DropdownService } from '../../shared/components/dropdown/dropdown.service';
import { NbaService } from '../nba.service';
import { DepthChartService } from '../depth-charts/depth-chart.service';
import { TeamStatsService } from './team-stats.service';
import { SchemaService } from '../../shared/services/schema.service';

@Component({
  selector: 'app-team-stats-gateway',
  templateUrl: './team-stats-gateway.component.html',
  styleUrls: ['./team-stats-gateway.component.scss']
})
export class TeamStatsGatewayComponent implements OnInit {
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
    private nbaService: NbaService,
    private depthChartService: DepthChartService,
    private teamStatsService: TeamStatsService,
    private schemaService: SchemaService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {

      this.params = {
        year: this.nbaService.getPreSelectedLeagueSeason() ||
        this.nbaService.getDefaultSeason(this.route.snapshot.data['teamStatsData'].seasons_dropdown)
      };

      this.handleApiResponse(this.route.snapshot.data['teamStatsData']);

      const savedDDs = this.teamStatsService.getSavedDD();
      if (savedDDs && savedDDs.conferenceDropdown && savedDDs.conferenceDropdown.length) {
        this.ddData = savedDDs;
        const statsType = this.teamStatsService.generateStatsTypeDD(null);
        this.ddData.statsType = statsType.statsType;
        this.ddData.activeStatsType = statsType.activeStatsType;
        this.onDdChange(false);
      } else {
        this.ddData = this.teamStatsService.generateTeamStatsDdObject();
      }

      this.ddData.seasons = this.data.seasons_dropdown.map(season => {
        return {
          ...season,
          name: this.nbaService.handleYear(season.year)
        }
      });
    });
  }

  onDdChange(callApi = true) {
    this.ddData.activeConference =  this.commonService.getActiveCheckBoxItems(this.ddData.conferenceDropdown, 'id')[0];
    this.teamStatsService.saveDD({
      conferenceDropdown: this.ddData.conferenceDropdown,
      seasonTypeDropdown: this.ddData.seasonTypeDropdown
    });
    if (callApi) {
      this.spinnerService.handleAPICall(this.teamStatsService.getTeamStatsData(this.params.year, null, {
        conference: this.ddData.activeConference
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
        label: 'NBA',
        url: '/nba'
      },
      {
        label: 'Teams',
        url: '/nba/teams'
      },
      {
        label: 'NBA Team Stats',
        url: `/nba/team-stats`
      }
    ];

    this.setSchema();

    this.breadcrumbService.changeBreadcrumbs(breadcrumbs);
  }

  onYearDdChange(season) {
    if (this.params.year === season.year) {
      return;
    }
    this.nbaService.setPreSelectedLeagueSeason(season.year);
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
      return this.router.navigate(['/nba/team-stats']);
    }
    return this.router.navigate([`/nba/team-stats/${this.ddData.activeStatsType}`]);
  }

  onViewMoreClick(data) {
    this.spinnerService.showSpinner();
    this.teamStatsService.setSortBy(data.sort_stat);
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
        'sport': 'Basketball',

        'url': `https://www.lineups.com${team.team_depth_chart_route}`,

        'memberOf': [
          {
            '@type': 'SportsOrganization',
            'name': 'NBA'
          }
        ]
      }
    });
    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      'NBA Team Stats (leaders)',
      // tslint:disable-next-line:max-line-length
      'NBA Team Stat leaders in the most important statistical categories such as shooting, passing and rebounding. Displaying the top 10 nba players in each category as well as their statistical totals.',
      'nba team stats leaders, nba team leader, nba team stat leaders',
      'https://www.lineups.com/nba/team-stats',
      'Dataset'
    ), ...teamsSchema]);
  }
}
