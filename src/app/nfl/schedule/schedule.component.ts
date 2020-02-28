import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TimeZoneService } from '../../shared/services/time-zone.service';
import { NflService } from '../nfl.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { ServerResponseService } from '../../shared/services/server-response.service';
import { ScheduleService } from './schedule.service';
import { TitleService } from '../../shared/services/title.service';
import { SchemaService } from '../../shared/services/schema.service';
import * as _ from 'lodash';
import { CommonService } from '../../shared/services/common.service';
import * as moment from 'moment';
@Component({
  selector: 'app-nfl-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  params: {week: number, year: string, seasonType?: string};
  pageTitle: string;
  breadcrumbs: any[];
  introParagraph: string;
  bottomParagraph: string;
  bottomHeader: string;
  scheduleData: any;
  mobileHeadings = {
    'Preseason': 'Preseason Schedule',
    'Playoff': 'Playoff Schedule',
    'Regular': 'NFL Schedule'
  };

  constructor(
    private nflService: NflService,
    private timeZoneService: TimeZoneService,
    private serverResponseService: ServerResponseService,
    private breadcrumbService: BreadcrumbService,
    private title: TitleService,
    private route: ActivatedRoute,
    private schemaService: SchemaService,
    private scheduleService: ScheduleService,
    private commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.onParamsUpdate(params);
    });
  }

  showMobileHeading() {
    if (this.pageTitle) {
      for (const key in this.mobileHeadings) {
        if (_.includes(this.pageTitle, key)) {
          return this.mobileHeadings[key];
        }
      }
    }
    return this.mobileHeadings['Regular'];
  }

  updateWeek({week, initial, seasonType}) {
    console.log('{week, initial, seasonType}', {week, initial, seasonType});
    // if (!initial && this.params.year === 'current') {
    //   if (seasonType === 1 && week && week > this.scheduleService.getTabBy(seasonType, 'prop').available_weeks) {
    //     week = 1;
    //   }
    //   if (seasonType !== 1) {
    //     week = null;
    //   }
    //   const url = `/nfl/schedule${this.scheduleService.getTabUrl(seasonType, true, true)}${week ? '/week-' + week : ''}`;
    //   return this.router.navigate([url]);
    // }
  }

  handleScheduleData(result) {
    // to prevent ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.pageTitle = result.heading;
      this.introParagraph = result.intro_paragraph;
      this.bottomParagraph = result.bottom_paragraph;
      this.bottomHeader = result.bottom_header;
      this.title.setTitle(this.pageTitle);
    })
  }

  private getPageNameBySeasonType(seasonType) {
    switch (seasonType) {
      case 'preseason-schedule': {
        return this.mobileHeadings['Preseason'];
      }
      case 'playoffs-schedule': {
        return this.mobileHeadings['Playoff'];
      }
      default: {
        return this.mobileHeadings['Regular'];
      }
    }
  }

  private onParamsUpdate(params) {
    this.scheduleData = this.route.snapshot.data['scheduleData'];
    console.log(params);
    this.breadcrumbs = [
      {
        label: 'NFL',
        url: '/nfl'
      },
      {
        label: params.seasonType || params.week ? 'NFL Schedule' : this.scheduleData.heading,
        url: '/nfl/schedule'
      }
    ];
    if (params.seasonType) {
      this.breadcrumbs.push({
        label: params.week ? this.getPageNameBySeasonType(params.seasonType) : this.scheduleData.heading,
        url: `/nfl/schedule${params.seasonType ? '/' + params.seasonType : ''}`
      })
    }
    // if (params && params.week) {
    //   this.params = {
    //     seasonType: params.seasonType,
    //     week: parseInt(params.week.substr(params.week.indexOf('week-') + 'week-'.length), 10),
    //     year: params.year || 'current'
    //   };
    //   if (this.params.year !== 'current') {
    //     this.breadcrumbs.push({
    //       label: `${this.nflService.handleYear(this.params.year)}`,
    //       url: `/nfl/schedule${params.seasonType ? '/' + params.seasonType : ''}/${this.params.year}`
    //     });
    //   }
    //   this.breadcrumbs.push({
    //     label: `Week ${this.params.week}`,
         // tslint:disable-next-line:max-line-length
    //     url: `/nfl/schedule${params.seasonType ? '/' + params.seasonType : ''}${this.params.year === 'current' ? '' : '/' + this.params.year}/week-${this.params.week}`
    //   });
    // } else {
      this.params = {
        week: null,
        seasonType: params.seasonType,
        year: params.year || 'current'
      };
      if (this.params.year !== 'current') {
        this.breadcrumbs.push({
          label: `${this.nflService.handleYear(this.params.year)}`,
          url: `/nfl/schedule${params.seasonType ? '/' + params.seasonType : ''}/${this.params.year}`
        });
      }
    // }
    this.setSchema();
    this.breadcrumbService.changeBreadcrumbs(this.breadcrumbs);
  }

  private setSchema() {
    const events = _.flatten(this.scheduleData.data.map(data => data.games)).reduce((filtered: any[], game: any) => {
      if (game && game.matchup_route && game.stadium_name) {
        const homeTeam = {
          '@type': 'SportsTeam',
          'name': game.home_team_full_name,
          'sport': 'American Football',
          'url': `https://www.lineups.com${game.home_depth_chart_route}`,
          'memberOf': [
            {
              '@type': 'SportsOrganization',
              'name': 'NFL'
            }
          ]
        };
        const awayTeam = {
          '@type': 'SportsTeam',
          'name': game.away_team_full_name,
          'sport': 'American Football',
          'url': `https://www.lineups.com${game.away_depth_chart_route}`,
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
        filtered.push({
          '@context': 'http://schema.org',
          '@type': 'SportsEvent',
          'name': `${game.away_team_full_name} at ${game.home_team_full_name}`,
          'description': `NFL game between ${game.home_team_full_name} and ${game.away_team_full_name}.
           Game start on ${moment(game.date).format('M/D/YY')} at ${game.stadium_name}`,
          'startDate': game.date,
          'endDate': game.date,
          'performers': [awayOrg, homeOrg],
          'location': {
            '@type': 'CivicStructure',
            'name': game.stadium_name,
            'address': game.stadium_name
          },
          'url': `https://www.lineups.com${game.matchup_route}`,
          'awayTeam': awayTeam,
          'homeTeam': homeTeam
        });
      }
      return filtered;
    }, []);
    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      'NFL Schedule',
      `NFL Schedule ${this.nflService.getDefaultSeason(this.scheduleData.seasons_dropdown, 'name')}.
       Every game with location, home team, away team, time and location`,
      `nfl schedule, nfl schedule ${this.nflService.getDefaultSeason(this.scheduleData.seasons_dropdown)}`,
      'https://www.lineups.com/nfl/schedule',
      'Dataset'
    ), ...(<any[]>events)]);
  }
}
