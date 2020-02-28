import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NflService } from '../../nfl.service';
import { isPlatformBrowser } from '@angular/common';
import { TitleService } from '../../../shared/services/title.service';
import { MatchupsService } from '../matchups.service';
import { Subscription } from 'rxjs';
import { ScheduleService } from '../../schedule/schedule.service';
import * as moment from 'moment';
import { DepthChartService } from '../../depth-charts/depth-chart.service';
import { SchemaService } from '../../../shared/services/schema.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-individual-matchup',
  templateUrl: './individual-matchup.component.html',
  styleUrls: ['./individual-matchup.component.scss']
})
export class IndividualMatchupComponent implements OnInit, OnDestroy {
  indMatchupDataWasChangedSubscription: Subscription;
  matchup: any;
  isCollapsed: boolean;
  showTabs: any;
  scheduleParams: any;
  params: {year?: string, date?: string, team_names: string};
  isBrowser: boolean;
  ddData: any;
  isDefaultYear: boolean;
  additionalInfo: any;

  private seasons: any[];
  constructor(
    private breadcrumbService: BreadcrumbService,
    private nflService: NflService,
    private route: ActivatedRoute,
    private matchupsService: MatchupsService,
    private router: Router,
    private scheduleService: ScheduleService,
    private depthChartService: DepthChartService,
    private schemaService: SchemaService,
    private commonService: CommonService,
    private title: TitleService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.route.params.subscribe((params: Params) => {
      this.showTabs = {
        schedule: false,
        injuries: false,
        matchupNews: false
      };
      this.params = {
        team_names: params.team_names
      };
      this.seasons = this.route.snapshot.data['matchup'][1];
      this.handleApiResponse(this.route.snapshot.data['matchup'][0]);
    });
    this.indMatchupDataWasChangedSubscription = this.matchupsService.indMatchupDataWasChanged
      .subscribe(res => {
        this.handleApiResponse(res);
      })
  }

  ngOnDestroy() {
    if (this.indMatchupDataWasChangedSubscription) {
      this.indMatchupDataWasChangedSubscription.unsubscribe();
    }
  }

  allowShortNames() {
    return this.isBrowser && window.innerWidth < 1120;
  }

  onTabClick(tabType, show: boolean) {
    for (const key in this.showTabs) {
      if (this.showTabs.hasOwnProperty(key)) {
        if (key === tabType) {
          this.showTabs[key] = show;
        } else {
          this.showTabs[key] = false;
        }
        this.commonService.scrollTopPage();
      }
    }
  }

  weekUpdated({week}) {
    this.scheduleParams.week = week;
  }

  isActive(url): boolean {
    return this.router.isActive(this.router.createUrlTree([url]), true);
  }

  performActionOnBreadcrumbClick(breadcrumb) {
    if (breadcrumb.week) {
      this.scheduleService.setPreSelectedWeek(breadcrumb.week);
    }
  }

  private handleApiResponse(res) {
    this.matchup = res;
    if (!this.matchup.nav.matchup_route) {
      this.matchup.nav.matchup_route = `/nfl/matchups/${this.params.team_names}`;
    }
    try {
      this.additionalInfo = {
        rain: this.matchup.header.details.rain,
        risk: this.matchup.header.details.risk,
        wind: this.matchup.header.details.wind
      };
    } catch (err) {
      console.error('Error in matchup weather obj');
    }
    console.log(this.matchup);

    const matchup_time = moment(this.matchup.nav.matchup_time);
    const formattedDateWithYear = matchup_time.format('M/D/YY');
    this.params.year = this.matchup.nav.matchup_season.toString();
    this.params.date = matchup_time.format('MM-DD');


    this.isDefaultYear = this.nflService.checkIfDefaultSeason(this.params.year, this.seasons);
    this.title.setTitle(`${this.matchup.header.away.away_full_name} at ${this.matchup.header.home.home_full_name} Matchup
     Week ${this.matchup.nav.week}, ${formattedDateWithYear}`);

    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NFL', url: '/nfl'},
      {label: 'Teams', url: '/nfl/teams'},
      {label: 'Matchups', url: '/nfl/matchups'},
      {
        label: this.nflService.handleYear(this.params.year),
        url: `/nfl/schedule${this.isDefaultYear ? '' : '/' + this.params.year}`
      },
      {
        label: `Week ${this.matchup.nav.week}`,
        url: this.isDefaultYear ? `/nfl/schedule` : `/nfl/schedule/${this.params.year}`,
        week: this.matchup.nav.week
      },
      {
        label: `${this.matchup.header.away.away_full_name} at ${this.matchup.header.home.home_full_name} Matchup ${formattedDateWithYear}`,
        url: `/nfl/matchups/${this.params.team_names}`
      }
    ]);
    this.setSchema();
    if (this.matchup.nav.away_depth_chart_route) {
      let year = this.matchup.nav.away_depth_chart_route.split('/').filter(item => item);
      year = year.length === 4 ? `${year[2]}` : 'current';
      this.scheduleParams = {
        week: this.matchup.nav.week,
        year: year
      }
    } else {
      this.scheduleParams = {
        week: this.matchup.nav.week || null,
        year: 'current'
      }
    }
  }

  preselectTeamSeason() {
    if (this.params && this.params.year) {
      this.depthChartService.setPreSelectedTeamSeason(this.params.year);
    }
  }

  private setSchema() {
    const awayTeam = {
      '@type': 'SportsTeam',
      'name': this.matchup.nav.away_name_full,
      'sport': 'American Football',
      'url': `https://www.lineups.com${this.matchup.nav.away_depth_chart_route}`,
      'memberOf': [
        {
          '@type': 'SportsOrganization',
          'name': 'NFL'
        }
      ]
    };
    const homeTeam = {
      '@type': 'SportsTeam',
      'name': this.matchup.nav.home_name_full,
      'sport': 'American Football',
      'url': `https://www.lineups.com${this.matchup.nav.home_depth_chart_route}`,
      'memberOf': [
        {
          '@type': 'SportsOrganization',
          'name': 'NFL'
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
      'name': `${awayTeam.name} at ${homeTeam.name}`,
      'startDate': this.matchup.header.details.game_time,
      'endDate': this.matchup.header.details.game_time,
      'description': `${homeTeam.name} vs. ${awayTeam.name}
       ${moment(this.matchup.header.details.game_time).format('M/D/YY')}`,
      'location': {
        '@type': 'CivicStructure',
        'name': this.matchup.header.details.stadium,
        'address': this.matchup.header.details.stadium
      },
      'performers': [awayOrg, homeOrg],
      'url': `https://www.lineups.com${this.matchup.nav.matchup_route}`,
      'awayTeam': awayTeam,
      'homeTeam': homeTeam
    };
    const schema: any[] = [this.commonService.generateDatasetSchema(
      `${homeTeam.name} vs. ${awayTeam.name}`,
      // tslint:disable-next-line:max-line-length
      `${homeTeam.name} vs. ${awayTeam.name} Matchup ${moment(this.matchup.header.details.game_time).format('M/D/YY')}, This page contains game Matchup information including Spread, Team Totals, Over/Under, Moneyline and matchup history.`,
      `${homeTeam.name} vs. ${awayTeam.name}
       ${moment(this.matchup.header.details.game_time).format('M/D/YY')},
       ${homeTeam.name} vs. ${awayTeam.name}`,
      `https://www.lineups.com${this.matchup.nav.matchup_route}`,
      `Dataset`,
    )];
    if (this.matchup.header.details.stadium) {
      schema.push(event);
    }
    this.schemaService.addSchema(schema);
  }
}
