import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { TitleService } from '../../shared/services/title.service';
import { SchemaService } from '../../shared/services/schema.service';
import { CommonService } from '../../shared/services/common.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NbaService } from '../nba.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  preSelectedDate: string;
  pageTitle: string;
  introParagraph: string;
  bottomParagraph: string;
  bottomHeader: string;
  private readonly defaultDate = '10/22/19';
  readonly startDate = new Date('10/1/16');

  constructor(
    private scheduleService: ScheduleService,
    private schemaService: SchemaService,
    private commonService: CommonService,
    private nbaService: NbaService,
    private title: TitleService
  ) { }

  ngOnInit() {
    this.preSelectedDate = this.scheduleService.getPreSelectedDate();
    if (this.preSelectedDate) {
      this.scheduleService.removePreSelectedDate();
    } else if (this.nbaService.forceOffseason) {
      this.preSelectedDate = this.defaultDate;
    } else {
      this.preSelectedDate = moment(new Date()).format('M/D/YYYY');
    }
    this.schemaService.addSchema(this.commonService.generateDatasetSchema(
      'NBA Schedule',
      // tslint:disable-next-line:max-line-length
      'Schedule for all NBA games. Schedule includes teams playing in the game, their record, time of game, links to starting lineup and matchup. Post game, the schedule pages display stats of the points leader, rebounds leader and assist leader.',
      'nba schedule',
      'https://www.lineups.com/nba/schedule',
      'Dataset'
    ));
  }

  ngOnDestroy() {
    this.scheduleService.removePreSelectedDate();
  }

  handleApiResponse(response) {
    if (response.page_title) {
      this.title.setTitle(response.page_title);
    }
    this.pageTitle = response.heading;
    this.introParagraph = response.intro_paragraph;
    this.bottomHeader = response.bottom_header;
    this.bottomParagraph = response.bottom_paragraph;
    this.setSchema(response.data)
  }

  private setSchema(data) {
    let datasets = data.reduce((filtered: any[], game: any) => {
      if (game.nav.matchup_route) {
        const awayTeam = {
          '@context': 'http://schema.org',
          '@type': 'SportsTeam',
          'name': game.nav.away_name_full,
          'sport': 'Basketball',
          'url': `https://www.lineups.com${game.nav.away_lineup_route}`,
          'memberOf': [
            {
              '@type': 'SportsOrganization',
              'name': 'NBA'
            }
          ]
        };
        const homeTeam = {
          '@context': 'http://schema.org',
          '@type': 'SportsTeam',
          'name': game.nav.home_name_full,
          'sport': 'Basketball',
          'url': `https://www.lineups.com${game.nav.home_lineup_route}`,
          'memberOf': [
            {
              '@type': 'SportsOrganization',
              'name': 'NBA'
            }
          ]
        };
        filtered.push(homeTeam, awayTeam, this.commonService.generateDatasetSchema(
          `${game.nav.home_name_full} vs. ${game.nav.away_name_full}`,
          `NBA game between ${game.nav.home_name_full} and ${game.nav.away_name_full}.
           Game start on ${moment(game.nav.matchup_time).format('M/D/YY')}`,
          `${game.nav.home_name_full} vs. ${game.nav.away_name_full} ${moment(game.nav.matchup_time).format('M/D/YY')},
           ${game.nav.home_name_full} vs. ${game.nav.away_name_full}`,
          `https://www.lineups.com${game.nav.matchup_route}`,
          `Dataset`
        ));
      }
      return filtered;
    }, []);
    datasets = _.uniq(datasets);
    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      'NBA Schedule',
      // tslint:disable-next-line:max-line-length
      'Schedule for all NBA games. Schedule includes teams playing in the game, their record, time of game, links to starting lineup and matchup. Post game, the schedule pages display stats of the points leader, rebounds leader and assist leader.',
      'nba schedule',
      'https://www.lineups.com/nba/schedule',
      'Dataset'
    ), ...datasets]);
  }
}
