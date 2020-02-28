
import { throwError as observableThrowError, Subscription, Observable, of, forkJoin as observableForkJoin } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LineupsGatewayService } from './lienups.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';
import { CommonService } from '../../shared/services/common.service';
import { DepthChartService } from '../depth-charts/depth-chart.service';
import { Meta } from '@angular/platform-browser';
import { SchemaService } from '../../shared/services/schema.service';
import { ScoreBarHelperService } from '../../score-bar/score-bar-helper.service';

@Component({
  selector: 'app-lineups-gateway',
  templateUrl: './lineups-gateway.component.html',
  styleUrls: ['./lineups-gateway.component.scss']
})
export class LineupsGatewayComponent implements OnInit, OnDestroy {
  showDepthChartsView = false;
  hideTabs = false;
  realTimeSubscription: Subscription;
  lineups;
  depthChartsList: any[];
  pageTitle: string;
  date = new Date();
  bottomParagraph: string;
  bottomHeader: string;
  introParagraph: string;
  loading = true;

  readonly posKeys = this.depthChartService.posKeys;
  readonly posKeysArr = this.depthChartService.posKeysArr;
  // Action Header Menu Button States
  // --------------------------------
  // Button Group 1
  groupOne = {
    sportActionActive: true,
    draftKingsActionActive: false,
    fanDuelActionActive: false,
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private lineupsGatewayService: LineupsGatewayService,
    private depthChartService: DepthChartService,
    private scoreBarService: ScoreBarHelperService,
    private commonService: CommonService,
    private title: TitleService,
    private schemaService: SchemaService,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.loading = true;
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NBA', url: '/nba'},
      {label: 'Teams', url: '/nba/teams'},
      {label: 'NBA Lineups', url: '/nba/lineups'}
    ]);
    observableForkJoin(
      this.lineupsGatewayService.getNbaStartingLineups(),
      this.depthChartService.getDepthChartsNewFormat().pipe(
        catchError((err) => {
          return of(null);
        }))
      ).pipe(
        catchError(err => {
          this.loading = false;
          return observableThrowError(err);
        })
      )
      .subscribe(([startingLineupsData, depthChartsData]) => {
        if (depthChartsData) {
          this.depthChartsList = this.depthChartService.handleDepthChartFormatting(depthChartsData.data);
        }
        if (startingLineupsData.meta) {
          this.meta.addTag({ name: 'description', content: startingLineupsData.meta });
        }
        if (startingLineupsData.page_title) {
          this.title.setTitle(startingLineupsData.page_title);
        }
        this.bottomHeader = startingLineupsData.bottom_header;
        this.bottomParagraph = startingLineupsData.bottom_paragraph;
        this.introParagraph = startingLineupsData.intro_paragraph;
        this.pageTitle = startingLineupsData.heading;
        this.lineups = this.lineupsGatewayService.sortLineups(startingLineupsData.data);
        this.setSchema();
        this.subscribeOnRealTimeUpdate();
        this.loading = false;
      });
  }

  ngOnDestroy() {
    if (this.realTimeSubscription) {
      this.realTimeSubscription.unsubscribe();
    }
    this.meta.removeTag('name="description"');
  }

  onButtonGroupClick(groupName, propertyName) {
    for (const key in this[groupName]) {
      if (this[groupName].hasOwnProperty(key)) {
        this[groupName][key] = false;
      }
    }
    this[groupName][propertyName] = true;
  }

  private subscribeOnRealTimeUpdate() {
    this.realTimeSubscription = this.scoreBarService.nbaScoreArrUpdated
      .subscribe((data) => {
        this.lineups = this.lineupsGatewayService.sortLineups(this.lineups.map(lineup => {
          const matchupStatus = data[lineup.nav.game_id];
          if (matchupStatus) {
            lineup.game_info.status = matchupStatus;
          }
          return lineup;
        }));
      });
  }

  private setSchema() {
    const teamsSchema = [];
    if (this.lineups && this.lineups.length) {
      this.lineups.forEach((game) => {
        teamsSchema.push(this.generateTeamLineupSchema('away', game), this.generateTeamLineupSchema('home', game));
      });
    }

    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      'NBA Starting Lineups',
      // tslint:disable-next-line:max-line-length
      'NBA projected and confirmed starting lineup for all NBA teams playing today as well as all NBA teams.  Starting players assists, rebounds and points are displayed as well as Injuries and odds for the games.',
      'nba starting lineups, nba projected lineups, nba confirmed lineups, nba lineups',
      'https://www.lineups.com/nba/lineups',
      'Dataset'
    ), ...teamsSchema]);
  }

  private generateTeamLineupSchema(mode: 'home' | 'away', game) {
    return {
      '@context': 'http://schema.org',
      '@type': 'SportsTeam',
      'name': game.game_info[mode + '_nav'].team_name_full,
      'sport': 'Basketball',

      'url': `https://www.lineups.com${game.game_info[mode + '_nav'].team_lineup_route}`,

      'memberOf': [
        {
          '@type': 'SportsOrganization',
          'name': 'NBA'
        }
      ],
      'member': game[mode + '_players'].map((player) => {
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
    };
  }

}
