
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';

// Services
import { DepthChartService } from './depth-chart.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';
import { CommonService } from '../../shared/services/common.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { NbaService } from '../nba.service';
import { SchemaService } from '../../shared/services/schema.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-depth-charts',
  templateUrl: './depth-charts.component.html',
  styleUrls: ['./depth-charts.component.scss']
})
export class DepthChartsComponent implements OnInit, OnDestroy {
  loading = true;
  params = {year: 'current'};
  depthChartsList: any[];
  pageHeading: string;
  isDefaultYear = true;
  data;
  readonly posKeys = this.depthChartService.posKeys;
  readonly posKeysArr = this.depthChartService.posKeysArr;
  constructor(
    private route: ActivatedRoute,
    private depthChartService: DepthChartService,
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService,
    private spinnerService: SpinnerService,
    private nbaService: NbaService,
    private schemaService: SchemaService,
    private meta: Meta,
    private title: TitleService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getGatewayData();
  }

  ngOnDestroy() {
    this.meta.removeTag('name="description"');
  }

  onYearDdChange(season) {
    if (this.nbaService.checkIfDefaultSeason(season.year, this.data.seasons_dropdown)) {
      this.depthChartService.removePreSelectedTeamSeason();
      return this.getGatewayData();
    }
    this.depthChartService.setPreSelectedTeamSeason(season.year);
    return this.getGatewayData(season.year);
  }

  showYear(year) {
    return this.nbaService.handleYear(year);
  }

  private getGatewayData(year?) {
    let apiCall = this.depthChartService.getDepthCharts(year);
    if (this.data) {
      apiCall = this.spinnerService.handleAPICall(apiCall);
    }
    apiCall.pipe(
      catchError(err => {
        this.loading = false;
        return observableThrowError(err);
      }))
      .subscribe((data) => {
        this.data = data;
        if (this.data.meta) {
          this.meta.removeTag('name="description"');
          this.meta.addTag({ name: 'description', content: this.data.meta });
        }
        if (year) {
          this.params.year = year;
          this.isDefaultYear = this.nbaService.checkIfDefaultSeason(this.params.year, this.data.seasons_dropdown)
        } else {
          this.params.year = this.nbaService.getDefaultSeason(this.data.seasons_dropdown);
          this.isDefaultYear = true;
        }
        this.pageHeading = this.data.heading ||
          `Depth Charts${this.isDefaultYear ? '' : ' ' + this.nbaService.handleYear(this.params.year)}`;
        this.breadcrumbService.changeBreadcrumbs([
          {label: 'NBA', url: '/nba'},
          {label: 'Teams', url: '/nba/teams'},
          {label: this.pageHeading, url: '/nba/depth-charts'},
        ]);
        this.title.setTitle(this.data.page_title || this.pageHeading);
        if (!data.data || !data.data.length) {
          this.depthChartsList = [];
        } else {
          this.depthChartsList = this.depthChartService.handleDepthChartFormatting(data.data);
          this.loading = false;
        }
        this.setSchema();
      });
  }

  private setSchema() {
    const teamSchema = [];
    if (this.depthChartsList && this.depthChartsList.length) {
      this.depthChartsList.forEach(team => {
        teamSchema.push(this.generateTeamSchema(team));
      });
    }
    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      'NBA Depth Charts',
      // tslint:disable-next-line:max-line-length
      'List of all NBA teams and their depth charts by position. Tables display player names, their position and their depth at the position.',
      'nba depth charts, nba team depth charts',
      'https://www.lineups.com/nba/depth-charts',
      'Dataset'
    ), ...teamSchema]);
  }

  private generateTeamSchema(teamData) {
    return {
      '@context': 'http://schema.org',
      '@type': 'SportsTeam',
      'name': teamData.team_fk.full_name,
      'sport': 'Basketball',

      'url': `https://www.lineups.com${teamData.team_fk.nav.team_depth_chart_route}`,

      'memberOf': [
        {
          '@type': 'SportsOrganization',
          'name': 'NBA'
        }
      ],
      'member': [
        ...this.generateMemberSchema(teamData, 'point_guards'),
        ...this.generateMemberSchema(teamData, 'shooting_guards'),
        ...this.generateMemberSchema(teamData, 'small_forwards'),
        ...this.generateMemberSchema(teamData, 'power_forwards'),
        ...this.generateMemberSchema(teamData, 'centers'),
      ]
    };
  }

  private generateMemberSchema(teamData, type) {
    return Object.keys(teamData[type]).map(key => {
      const player = teamData[type][key];
      return {
        '@type': 'OrganizationRole',
        'member': {
          '@type': 'Person',
          'name': player.name,
          'url': 'https://www.lineups.com' + player.profile_url,
        },
        'roleName': player.position
      };
    })
  }
}
