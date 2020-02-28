import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../schedule.service';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { ActivatedRoute, Params } from '@angular/router';
import { IsBeforeAfterPipe } from '../../../shared/pipes/isBeforeAfter.pipe';
import { NflService } from '../../nfl.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { TitleService } from '../../../shared/services/title.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { SchemaService } from '../../../shared/services/schema.service';
import { CommonService } from '../../../shared/services/common.service';
import * as moment from 'moment';

@Component({
  selector: 'app-team-schedule',
  templateUrl: './team-schedule.component.html',
  styleUrls: ['../schedule.component.scss', './team-schedule.component.scss']
})
export class TeamScheduleComponent implements OnInit {
  params: {year?: string, team_name: string};
  teamSchedule;
  finishedGames: any[];
  notPlayedGames: any[];
  isCollapsed: boolean;
  isDefaultSeason: boolean;
  ddData;
  constructor(
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private dropdownService: DropdownService,
    private spinnerService: SpinnerService,
    private schemaService: SchemaService,
    private commonService: CommonService,
    private nflService: NflService,
    private title: TitleService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.params = {
        team_name: params.team_name
      };
      this.handleScheduleResponse(this.route.snapshot.data['scheduleData']);
    });
  }

  onYearDdChange(season) {
    this.spinnerService.handleAPICall(this.scheduleService.getTeamSchedule(this.params.team_name, season.year))
      .subscribe(res => {
        this.handleScheduleResponse(res, season.year);
      });
  }

  sortMatchups(game) {
    return `${game.team_depth_chart} ${game.team_abbr === game.home_team ? 'vs' : 'at'} ${game.opponent_depth_chart}`;
  }

  private handleScheduleResponse(res, year?) {
    this.teamSchedule = res;
    this.params.year = year || this.scheduleService.getPreSelectedTeamSeason() ||
      this.nflService.getDefaultSeason(this.teamSchedule.seasons_dropdown);
    this.scheduleService.removePreSelectedTeamSeason();

    this.isDefaultSeason = this.nflService.checkIfDefaultSeason(this.params.year, this.teamSchedule.seasons_dropdown);
    this.finishedGames = new IsBeforeAfterPipe().transform(this.teamSchedule.data, false, 'date');
    this.notPlayedGames = new IsBeforeAfterPipe().transform(this.teamSchedule.data, true, 'date');
    this.title.setTitle(this.teamSchedule.page_title);
    this.setSchema();
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NFL', url: '/nfl'},
      {label: 'Teams', url: '/nfl/teams'},
      {label: 'Schedule', url: '/nfl/schedule'},
      {
        label: this.nflService.handleYear(this.params.year),
        url: `/nfl/schedule${this.isDefaultSeason ? '' : '/' + this.params.year}`
      },
      {
        label: this.teamSchedule.heading,
        url: `/nfl/schedule/${this.params.team_name}`
      }
    ]);
  }

  showYear(year) {
    return this.nflService.handleYear(year);
  }

  private setSchema() {
    const events = this.teamSchedule.data.reduce((filtered: any[], game: any) => {
      if (game && game.matchup_route && game.stadium_name) {
        const team = {
          '@type': 'SportsTeam',
          'name': game.team_depth_chart,
          'sport': 'American Football',
          'url': `https://www.lineups.com${game.team_depth_chart_route}`,
          'memberOf': [
            {
              '@type': 'SportsOrganization',
              'name': 'NFL'
            }
          ]
        };
        const oppTeam = {
          '@type': 'SportsTeam',
          'name': game.opponent_depth_chart,
          'sport': 'American Football',
          'url': `https://www.lineups.com${game.opponent_depth_chart_route}`,
          'memberOf': [
            {
              '@type': 'SportsOrganization',
              'name': 'NFL'
            }
          ]
        };
        const teamOrg = {
          '@type': 'Organization',
          'name': team.name,
          'url': team.url,
          'memberOf': team.memberOf
        };
        const oppOrg = {
          '@type': 'Organization',
          'name': oppTeam.name,
          'url': oppTeam.url,
          'memberOf': oppTeam.memberOf
        };
        filtered.push({
          '@context': 'http://schema.org',
          '@type': 'SportsEvent',
          'name': `${game.team_depth_chart} ${game.team_abbr === game.home_team ? 'vs' : 'at'} ${game.opponent_depth_chart}`,
          'description': `NFL game between ${game.team_depth_chart} and ${game.opponent_depth_chart}.
           Game start on ${moment(game.date).format('M/D/YY')} at ${game.stadium_name}`,
          'startDate': game.date,
          'performers': [oppOrg, teamOrg],
          'endDate': game.date,
          'location': {
            '@type': 'CivicStructure',
            'name': game.stadium_name,
            'address': game.stadium_name
          },
          'url': `https://www.lineups.com${game.matchup_route}`,
          'awayTeam': game.team_abbr === game.home_team ? oppTeam : team,
          'homeTeam': game.team_abbr === game.home_team ? team : oppTeam,
        });
      }
      return filtered;
    }, []);
    this.schemaService.addSchema([
      this.commonService.generateDatasetSchema(
        `${this.teamSchedule.nav.team_name_full} Schedule`,
        `${this.teamSchedule.nav.team_name_full} schedule
         ${this.nflService.getDefaultSeason(this.teamSchedule.seasons_dropdown, 'name')}.
         Full team schedule, location, date, time.`,
        `${this.teamSchedule.nav.team_name_full} schedule, ${this.teamSchedule.nav.team_name_full} schedule
          ${this.nflService.getDefaultSeason(this.teamSchedule.seasons_dropdown, 'name')}`,
        `https://www.lineups.com/nfl/schedule/${this.params.team_name}`,
        'Dataset',
      ),
      ...(<any[]>events)
    ]);
  }
}
