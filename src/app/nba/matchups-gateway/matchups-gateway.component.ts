
import {throwError as observableThrowError, Subscription } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbaMatchupsService } from './matchups.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';
import { NbaService } from '../nba.service';
import { SchemaService } from '../../shared/services/schema.service';
import { CommonService } from '../../shared/services/common.service';
import * as moment from 'moment';
import { ScoreBarHelperService } from '../../score-bar/score-bar-helper.service';

@Component({
  selector: 'app-matchups-gateway',
  templateUrl: './matchups-gateway.component.html',
  styleUrls: ['./matchups-gateway.component.scss']
})
export class MatchupsGatewayComponent implements OnInit, OnDestroy {
  realTimeSubscription: Subscription;
  matchups: any;
  showedIndividualMatchup: string = null;
  date = new Date();
  pageTitle: string;
  introParagraph: string;
  loading = true;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private matchupsService: NbaMatchupsService,
    private scoreBarService: ScoreBarHelperService,
    private commonService: CommonService,
    public nbaService: NbaService,
    private title: TitleService,
    private schemaService: SchemaService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NBA', url: '/nba'},
      {label: 'Teams', url: '/nba/teams'},
      {label: 'NBA Matchups', url: '/nba/matchups'},
    ]);
    this.matchupsService.getTodayMatchups().pipe(
      catchError((err) => {
        this.loading = false;
        return observableThrowError(err);
      }))
      .subscribe((res) => {
        this.loading = false;
        this.pageTitle = res.heading;
        this.introParagraph = res.intro_paragraph;
        if (res.page_title) {
          this.title.setTitle(res.page_title);
        }
        if (res.data && res.data.length) {
          this.matchups = this.matchupsService.sortMatchups(res.data.map(matchup => {
            matchup.showed = true;
            return matchup;
          }));
          this.setSchema();
          this.subscribeOnRealTimeUpdate();
        }
      })
  }

  ngOnDestroy() {
    if (this.realTimeSubscription) {
      this.realTimeSubscription.unsubscribe();
    }
  }

  onToggleItem(event, matchup): void {
    event.stopPropagation();
    matchup.showed = !matchup.showed;
    const showedMatchups = this.matchups.filter(matchupItem => matchupItem.showed);
    if (showedMatchups.length === 1) {
      this.showedIndividualMatchup = showedMatchups[0].game_id || showedMatchups[0].game_key_id;
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

  private subscribeOnRealTimeUpdate() {
    this.realTimeSubscription = this.scoreBarService.nbaScoreArrUpdated
      .subscribe((data) => {
        this.matchups = this.matchupsService.sortMatchups(this.matchups.map(matchup => {
          const matchupStatus = data[matchup.nav.game_id];
          if (matchupStatus) {
            matchup.nav.status = matchupStatus;
          }
          return matchup;
        }));
      });
  }

  private setSchema() {
    const events = this.matchups.reduce((filtered: any[], game: any) => {
      if (game.gateway && game.gateway.matchup_route && game.header.details.stadium) {
        const awayTeam = {
          '@type': 'SportsTeam',
          'name': game.gateway.away.full_name,
          'sport': 'Basketball',
          'url': `https://www.lineups.com${game.gateway.away.lineup_route}`,
          'memberOf': [
            {
              '@type': 'SportsOrganization',
              'name': 'NBA'
            }
          ]
        };
        const homeTeam = {
          '@type': 'SportsTeam',
          'name': game.gateway.home.full_name,
          'sport': 'Basketball',
          'url': `https://www.lineups.com${game.gateway.home.lineup_route}`,
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
        filtered.push({
          '@context': 'http://schema.org',
          '@type': 'SportsEvent',
          'name': `${game.gateway.away.full_name} at ${game.gateway.home.full_name}`,
          'startDate': game.header.details.game_time,
          'endDate': game.header.details.game_time,
          'description': `NBA game between ${game.gateway.home.full_name} and ${game.gateway.away.full_name}.
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
          `${game.gateway.home.full_name} vs. ${game.gateway.away.full_name}`,
          `NBA game between ${game.gateway.home.full_name} and ${game.gateway.away.full_name}.
           Game start on ${moment(game.header.details.game_time).format('M/D/YY')} at ${game.header.details.stadium}`,
          `${game.gateway.home.full_name} vs. ${game.gateway.away.full_name} ${moment(game.header.details.game_time).format('M/D/YY')},
           ${game.gateway.home.full_name} vs. ${game.gateway.away.full_name}`,
          `https://www.lineups.com${game.gateway.matchup_route}`,
          `Dataset`
        ));
      }
      return filtered;
    }, []);
    this.schemaService.addSchema([...events]);
  }
}
