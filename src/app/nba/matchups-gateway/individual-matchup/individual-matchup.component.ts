import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { NbaService } from '../../nba.service';
import { ScheduleService } from '../../schedule/schedule.service';
import { isPlatformBrowser } from '@angular/common';
import { TitleService } from '../../../shared/services/title.service';
import { Subscription } from 'rxjs';
import { NbaMatchupsService } from '../matchups.service';
import * as moment from 'moment';
import { TeamLineupService } from '../../team-lineup/team-lineup.service';
import { CommonService } from '../../../shared/services/common.service';
import { SchemaService } from '../../../shared/services/schema.service';
import * as _ from 'lodash';
import { ScoreBarHelperService } from '../../../score-bar/score-bar-helper.service';


interface MatchupParams {
  team_names?: string
  year?: string
  date?: string
}

@Component({
  selector: 'app-individual-matchup',
  templateUrl: './individual-matchup.component.html',
  styleUrls: ['./individual-matchup.component.scss']
})
export class IndividualMatchupComponent implements OnInit, OnDestroy {
  indMatchupDataWasChangedSubscription: Subscription;
  realTimeSubscription: Subscription;
  ddData: any;
  data: any;
  showTabs: any;
  isCollapsed: boolean;
  isBrowser: boolean;
  matchupNav: any;
  params: MatchupParams;
  preSelectedDate: string;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private scoreBarService: ScoreBarHelperService,
    private nbaService: NbaService,
    private route: ActivatedRoute,
    private router: Router,
    private title: TitleService,
    private matchupsService: NbaMatchupsService,
    private teamLineupService: TeamLineupService,
    private commonService: CommonService,
    private scheduleService: ScheduleService,
    private schemaService: SchemaService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.indMatchupDataWasChangedSubscription = this.matchupsService.indMatchupDataWasChanged
      .subscribe(res => {
        this.handleApiResponse(this.params, res);
      });

    this.route.params.subscribe((params: Params) => {
      this.handleApiResponse(params, this.route.snapshot.data['matchup']);
    });
  }

  ngOnDestroy() {
    if (this.indMatchupDataWasChangedSubscription) {
      this.indMatchupDataWasChangedSubscription.unsubscribe();
    }
    if (this.realTimeSubscription) {
      this.realTimeSubscription.unsubscribe();
    }
  }

  private handleApiResponse(params, res) {
    this.showTabs = {
      injuries: false,
      schedule: false,
      matchupNews: false
    };
    this.handleMatchupDetailsPageData(params, res);
    if (this.matchupNav.matchup_day) {
      this.preSelectedDate = moment(this.matchupNav.matchup_day, 'YYYY-MM-DD').format('MM/DD/YYYY');
    }
  }

  private handleMatchupDetailsPageData(params: MatchupParams, data) {
    this.params = {
      team_names: params.team_names
    };
    this.matchupNav = data.nav;
    this.data = data;
    this.subscribeOnRealTimeUpdate();
    const matchup_time = moment(this.matchupNav.matchup_time);
    const formattedYearTime = matchup_time.format('M/D/YY');
    this.params.year = this.matchupNav.matchup_season;
    this.params.date = matchup_time.format('MM-DD');
    const formattedDate = matchup_time.format('M/D');
    const title = `${this.matchupNav.away_name_full} at ${this.matchupNav.home_name_full} Matchup ${formattedYearTime}`;
    this.title.setTitle(title);
    this.setSchema();
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NBA', url: '/nba'},
      {label: 'Teams', url: '/nba/teams'},
      {label: 'Matchups', url: '/nba/matchups'},
      {
        label: this.nbaService.handleYear(this.params.year),
        url: '/nba/schedule',
        key: `/nba/schedule/year`
      },
      {
        label: `${formattedDate}`,
        url: `/nba/schedule`,
        key: `/nba/schedule/date`
      },
      {
        label: title,
        url: `/nba/matchups/${this.params.team_names}`
      }
    ]);
  }

  performActionOnBreadcrumbClick(breadcrumb) {
    if (breadcrumb.key && _.includes(breadcrumb.key, '/nba/schedule/date')) {
      this.scheduleService.setPreSelectedDate(moment(this.matchupNav.matchup_time).format('MM-DD-YYYY'));
    }
    if (breadcrumb.key && _.includes(breadcrumb.key, '/nba/schedule/year')) {
      this.scheduleService.setStartSeasonPreselectedDate(parseInt(this.params.year, 10));
    }
  }

  onTabClick(tabType, show: boolean, pageType?) {
    for (const key in this.showTabs) {
      if (this.showTabs.hasOwnProperty(key)) {
        if ((!pageType || this.route.snapshot.data['page'] === pageType)) {
          if (key === tabType) {
            this.showTabs[key] = show;
          } else {
            this.showTabs[key] = false;
          }
          this.commonService.scrollTopPage();
        }
      }
    }
  }

  isActive(url): boolean {
    return this.router.isActive(this.router.createUrlTree([url]), true);
  }

  allowShortNames() {
    return this.isBrowser && window.innerWidth < 1200;
  }

  preselectTeamSeason() {
    if (this.params && this.params.year) {
      this.teamLineupService.setPreSelectedTeamSeason(this.params.year);
    }
  }

  private subscribeOnRealTimeUpdate() {
    if (this.realTimeSubscription) {
      return;
    }
    this.realTimeSubscription = this.scoreBarService.nbaScoreArrUpdated
      .subscribe((data) => {
        const matchupStatus = data[this.matchupNav.game_id];
        if (matchupStatus && this.matchupNav) {
          this.matchupNav.status = matchupStatus;
        }
      });
  }

  private setSchema() {
    const awayTeam = {
      '@type': 'SportsTeam',
      'name': this.data.gateway.gateway.away.full_name,
      'sport': 'Basketball',
      'url': `https://www.lineups.com${this.data.gateway.gateway.away.lineup_route}`,
      'memberOf': [
        {
          '@type': 'SportsOrganization',
          'name': 'NBA'
        }
      ]
    };
    const homeTeam = {
      '@type': 'SportsTeam',
      'name': this.data.gateway.gateway.home.full_name,
      'sport': 'Basketball',
      'url': `https://www.lineups.com${this.data.gateway.gateway.home.lineup_route}`,
      'memberOf': [
        {
          '@type': 'SportsOrganization',
          'name': 'NBA'
        }
      ]
    };
    const homeOrg = {
      '@type': 'Organization',
      'name': homeTeam.name,
      'url': homeTeam.url,
      'memberOf': homeTeam.memberOf
    };
    const awayOrg = {
      '@type': 'Organization',
      'name': awayTeam.name,
      'url': awayTeam.url,
      'memberOf': awayTeam.memberOf
    };
    const event = {
      '@context': 'http://schema.org',
      '@type': 'SportsEvent',
      'name': `${this.data.gateway.gateway.away.full_name} at ${this.data.gateway.gateway.home.full_name}`,
      'startDate': this.data.gateway.header.details.game_time,
      'endDate': this.data.gateway.header.details.game_time,
      'description': `${this.data.gateway.gateway.home.full_name} vs. ${this.data.gateway.gateway.away.full_name}
       ${moment(this.data.gateway.header.details.game_time).format('M/D/YY')}`,
      'location': {
        '@type': 'CivicStructure',
        'name': this.data.gateway.header.details.stadium,
        'address': this.data.gateway.header.details.stadium
      },
      'performers': [awayOrg, homeOrg],
      'url': `https://www.lineups.com${this.data.gateway.gateway.matchup_route}`,
      'awayTeam': awayTeam,
      'homeTeam': homeTeam
    };
    const schema: any[] = [this.commonService.generateDatasetSchema(
      `${this.data.gateway.gateway.home.full_name} vs. ${this.data.gateway.gateway.away.full_name}`,
      // tslint:disable-next-line:max-line-length
      `${this.data.gateway.gateway.home.full_name} vs. ${this.data.gateway.gateway.away.full_name} Matchup ${moment(this.data.gateway.header.details.game_time).format('M/D/YY')}. This page contains game Matchup information including Spread, Team Totals, Over/Under, Moneyline and matchup history.`,
      `${this.data.gateway.gateway.home.full_name} vs. ${this.data.gateway.gateway.away.full_name}
       ${moment(this.data.gateway.header.details.game_time).format('M/D/YY')},
       ${this.data.gateway.gateway.home.full_name} vs. ${this.data.gateway.gateway.away.full_name}`,
      `https://www.lineups.com${this.data.gateway.gateway.matchup_route}`,
      `Dataset`,
    )];
    if (this.data.gateway.header.details.stadium) {
      schema.push(event);
    }
    this.schemaService.addSchema(schema);
  }
}
