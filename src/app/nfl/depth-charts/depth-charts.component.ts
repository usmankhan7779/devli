
import {throwError as observableThrowError, forkJoin as observableForkJoin,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';

// Services
import { DepthChartService } from './depth-chart.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';
import { CommonService } from '../../shared/services/common.service';
import { RosterService } from '../roster/roster.service';
import { SchemaService } from '../../shared/services/schema.service';
import * as _ from 'lodash';
import { Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-depth-charts',
  templateUrl: './depth-charts.component.html',
  styleUrls: ['./depth-charts.component.scss']
})
export class DepthChartsComponent implements OnInit, OnDestroy {
  showDepthChartsAlternativeView = true;
  alternativeDps: any[];
  loading = true;
  pageTitle: string;
  introParagraph: string;
  bottomParagraph: string;
  bottomHeading: string;
  depthChartsList: any[];
  depthChartsRouteList: any[];
  params: {year: string, team_name: string};
  sportActionActive = true;
  fantasyActionActive = false;
  draftKingsActionActive = true;
  fanDuelActionActive = false;
  yahooActionActive = false;

  constructor(
    private route: ActivatedRoute,
    private depthChartService: DepthChartService,
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService,
    private rosterService: RosterService,
    private schemaService: SchemaService,
    private title: TitleService,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.loading = true;
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NFL', url: '/nfl'},
      {label: 'Teams', url: '/nfl/teams'},
      {label: 'Depth Charts', url: '/nfl/depth-charts'},
    ]);
    observableForkJoin([this.rosterService.getRosterRoutes(), this.depthChartService.getDepthCharts()]).pipe(
      catchError(err => {
        this.loading = false;
        return observableThrowError(err);
      }))
      .subscribe(([rosterData, {depth_charts, page_title, heading, intro_paragraph, bottom_header, bottom_paragraph, meta}]) => {
        this.pageTitle = heading;
        this.introParagraph = intro_paragraph;
        this.bottomParagraph = bottom_paragraph;
        this.bottomHeading = bottom_header;
        if (page_title) {
          this.title.setTitle(page_title);
        }
        if (meta) {
          this.meta.removeTag('name="description"');
          this.meta.addTag({ name: 'description', content: meta });
        }
        if (depth_charts && depth_charts.length) {
          depth_charts.sort((a, b) => {
            if (a.game_info.game_time_dt < b.game_info.game_time_dt) {
              return -1;
            }
            if (a.game_info.game_time_dt > b.game_info.game_time_dt) {
              return 1;
            }
            return 0;
          });
          const inProgressDepthCharts = depth_charts.filter(item => item.status && item.status.status === 'In Progress');
          const notInProgressDepthCharts = depth_charts.filter(item => !item.status || item.status.status !== 'In Progress');
          this.depthChartsList = [...inProgressDepthCharts, ...notInProgressDepthCharts];
          this.alternativeDps = this.depthChartService.createAlternativeStructure(this.depthChartsList, rosterData);
          this.setSchema();
          this.loading = false;
        } else {
          this.depthChartService.getDepthChartsRoutes()
            .subscribe(res => {
              this.depthChartsRouteList = this.commonService.createArrayFromNamedObj(res.depth_charts_routes);
              this.loading = false;
            });
        }
      });
  }

  ngOnDestroy() {
    this.meta.removeTag('name="description"');
  }

  // Click Listeners
  // ---------------

  // Button Group 1 Actions
  onSportAction() {
    this.sportActionActive = true;
    this.fantasyActionActive = false;
  }

  onFantasyAction() {
    this.fantasyActionActive = true;
    this.sportActionActive = false;
  }

  // Button Group 2 Actions
  onDraftKingsAction() {
    this.draftKingsActionActive = true;
    this.fanDuelActionActive = false;
    this.yahooActionActive = false;
  }

  onFanDuelAction() {
    this.draftKingsActionActive = false;
    this.fanDuelActionActive = true;
    this.yahooActionActive = false;
  }

  onYahooAction() {
    this.draftKingsActionActive = false;
    this.fanDuelActionActive = false;
    this.yahooActionActive = true;
  }

  // Navigation
  onNavigateToAwayDC(awayTeamRoute) {
    console.log(awayTeamRoute);
  }

  onNavigateToHomeDC(homeTeamRoute) {
    console.log(homeTeamRoute);
  }

  // Helper Functions
  // ----------------
  _getStatColor(rating) {
    const hue = ((1 - rating) * 120).toString(10);
    const colorValue = 'hsl(' + hue + ',100%,50%)'
    return colorValue;
  }

  private setSchema() {
    const teamsSchema = [];
    if (this.alternativeDps && this.alternativeDps.length) {
      this.alternativeDps.forEach((game) => {
        teamsSchema.push(this.generateTeamSchema(game));
      });
    }

    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      'NFL Depth Charts',
      // tslint:disable-next-line:max-line-length
      'NFL Depth Charts for all NFL teams playing today as well as all NFL teams. Starting players assists, rebounds and points are displayed as well as Injuries and odds for the games.',
      'nfl depth charts',
      'https://www.lineups.com/nfl/depth-charts',
      'Dataset'
    ), ...teamsSchema]);
  }

  private generateTeamSchema(game) {
    return {
      '@context': 'http://schema.org',
      '@type': 'SportsTeam',
      'name': game.team_full,
      'sport': 'American Football',

      'url': `https://www.lineups.com${game.depth_chart_route}`,

      'memberOf': [
        {
          '@type': 'SportsOrganization',
          'name': 'NFL'
        }
      ],
      'member': _.flatten(Object.keys(game.players).map((k) => game.players[k])).map((player) => {
        return {
          '@type': 'OrganizationRole',
          'member': {
            '@type': 'Person',
            'name': player.name,
            'url': 'https://www.lineups.com' + player.profile_url,
          },
          'roleName': player.draftkings_position || player.fanduel_position || player.yahoo_position
        };
      })
    };
  }
}
