
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { MatchupsService } from './matchups.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';
import { SchemaService } from '../../shared/services/schema.service';
import { CommonService } from '../../shared/services/common.service';
import * as moment from 'moment';

@Component({
  selector: 'app-matchups-gateway',
  templateUrl: './matchups-gateway.component.html',
  styleUrls: ['./matchups-gateway.component.scss']
})
export class MatchupsGatewayComponent implements OnInit {
  matchups: any;
  showedIndividualMatchup: string = null;
  pageTitle: string;
  loading = true;
  introParagraph: string;
  bottomInfo: any;
  updatedTime;

  constructor(
    private matchupsService: MatchupsService,
    private breadcrumbService: BreadcrumbService,
    private schemaService: SchemaService,
    private commonService: CommonService,
    private title: TitleService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NFL', url: '/nfl'},
      {label: 'Teams', url: '/nfl/teams'},
      {label: 'Matchups', url: '/nfl/matchups'}
    ]);
    this.matchupsService.getTodayMatchups().pipe(
      catchError((err) => {
        this.loading = false;
        this.pageTitle = 'NFL Matchups';
        this.title.setTitle(this.pageTitle);
        return observableThrowError(err);
      }))
      .subscribe(({matchups, heading, page_title, intro_paragraph, updated, bottom_paragraph, bottom_header}) => {
        this.loading = false;
        this.updatedTime = updated;
        this.bottomInfo = {
          bottom_header,
          bottom_paragraph
        };
        this.introParagraph = intro_paragraph;
        this.pageTitle = heading;
        if (page_title) {
          this.title.setTitle(page_title);
        }
        if (matchups && matchups.length > 0) {
          this.matchups = matchups.map(matchup => {
            matchup.showed = true;
            return matchup;
          });
          this.setSchema();
        }
      })
  }

  onToggleItem(event, matchup): void {
    event.stopPropagation();
    matchup.showed = !matchup.showed;
    const showedMatchups = this.matchups.filter(matchupItem => matchupItem.showed);
    if (showedMatchups.length === 1) {
      this.showedIndividualMatchup = showedMatchups[0].game_key_id;
    } else if (this.showedIndividualMatchup) {
      this.showedIndividualMatchup = null;
    }
  }

  showSelectNone() {
    const showedMatchups = this.matchups.filter(matchup => matchup.showed).length;
    if (showedMatchups !== 0) {
      return true;
    }
    return false;
  }

  private setSchema() {
    const events = this.matchups.reduce((filtered: any[], game: any) => {
      if (game.gateway && game.gateway.matchup_route && game.header.details.stadium) {
        const awayTeam = {
          '@type': 'SportsTeam',
          'name': game.gateway.away.full_name,
          'sport': 'American Football',
          'url': `https://www.lineups.com${game.gateway.away.depth_chart_route}`,
          'memberOf': [
            {
              '@type': 'SportsOrganization',
              'name': 'NFL'
            }
          ]
        };
        const homeTeam = {
          '@type': 'SportsTeam',
          'name': game.gateway.home.full_name,
          'sport': 'American Football',
          'url': `https://www.lineups.com${game.gateway.home.depth_chart_route}`,
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
          'name': `${game.gateway.away.full_name} at ${game.gateway.home.full_name}`,
          'startDate': game.header.details.game_time,
          'endDate': game.header.details.game_time,
          'description': `NFL game between ${game.gateway.home.full_name} and ${game.gateway.away.full_name}.
           Game start on ${moment(game.header.details.game_time).format('M/D/YY')} at ${game.header.details.stadium}`,
          'location': {
            '@type': 'CivicStructure',
            'name': game.header.details.stadium,
            'address': game.header.details.stadium
          },
          'url': `https://www.lineups.com${game.gateway.matchup_route}`,
          'performers': [awayOrg, homeOrg],
          'awayTeam': awayTeam,
          'homeTeam': homeTeam
        }, this.commonService.generateDatasetSchema(
          `${game.header.home.home_full_name} vs. ${game.header.away.away_full_name}`,
          `NFL game between ${game.header.home.home_full_name} and ${game.header.away.away_full_name}.
               Game start on ${moment(game.header.details.game_time).format('M/D/YY')}`,
          `${game.header.home.home_full_name} vs. ${game.header.away.away_full_name}
               ${moment(game.header.details.game_time).format('M/D/YY')},
               ${game.header.home.home_full_name} vs. ${game.header.away.away_full_name}`,
          `https://www.lineups.com${game.game_key}`,
          `Dataset`
        ));
      }
      return filtered;
    }, []);
    this.schemaService.addSchema([...events]);
  }
}
