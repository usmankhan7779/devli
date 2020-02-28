import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IsBeforeAfterPipe } from '../../../shared/pipes/isBeforeAfter.pipe';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { TimeZoneService } from '../../../shared/services/time-zone.service';
import { CommonService } from '../../../shared/services/common.service';
import { NbaService } from '../../nba.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { TitleService } from '../../../shared/services/title.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { ScheduleService } from '../schedule.service';
import { TeamLineupService } from '../../team-lineup/team-lineup.service';

@Component({
  selector: 'app-team-schedule',
  templateUrl: './team-schedule.component.html',
  styleUrls: ['./team-schedule.component.scss']
})
export class TeamScheduleComponent implements OnInit {
  teamSchedule: any;
  params: {year?: string, team_name: string};
  finishedGames: any[];
  notPlayedGames: any[];
  ddData: any = {
    activeTab: 'all',
    tabs: [
      {
        name: 'All Games',
        prop: 'all',
        selected: true
      },
      {
        name: 'Upcoming Games',
        prop: 'upcoming',
        selected: false
      },
      {
        name: 'Completed Games',
        prop: 'completed',
        selected: false
      }
    ]
  };
  timeZone = this.timeZoneService.getTimeZoneAbbr();

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService,
    private nbaService: NbaService,
    private timeZoneService: TimeZoneService,
    private spinnerService: SpinnerService,
    private teamLineupService: TeamLineupService,
    private dropdownService: DropdownService,
    private scheduleService: ScheduleService,
    private title: TitleService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.params = {
        team_name: params.team_name
      };
      this.handleScheduleResponse(this.route.snapshot.data['data']);
    });
  }

  onYearDdChange(season) {
    this.spinnerService.handleAPICall(this.scheduleService.getTeamSchedule(this.params.team_name, season.year))
      .subscribe(res => {
        this.teamLineupService.changeTeamLineupYear(res, season.year);
        this.handleScheduleResponse(res, season.year);
      });
  }

  sortScore(game) {
    return this.teamSchedule.nav.team_abbr !== game.home_team ? (game.away_team_score || 0) : (game.home_team_score || 0);
  }

  sortRecord(game) {
    return this.teamSchedule.nav.team_abbr !== game.home_team ? (game.away_wins || 0) : (game.home_wins || 0);
  }

  getMatchupName(game) {
    return `${game.nav.away_name} at ${game.nav.home_name}`;
  }

  sortLineup(compareKeyOne: string, compareKeyTwo: string, ifTrue: string, ifFalse: string,  game) {
    return game[compareKeyOne] === game[compareKeyTwo] ? game.nav[ifTrue] : game.nav[ifFalse];
  }

  onDropdownChange() {
    this.ddData.activeTab = this.commonService.getActiveCheckBoxItems(this.ddData.tabs, 'prop')[0];
  }

  handleYear(year) {
    return this.nbaService.handleYear(year);
  }

  onButtonGroupClick(tabProp) {
    for (const tab of this.ddData.tabs) {
      tab.selected = false;
      if (tab.prop === tabProp) {
        tab.selected = true;
        this.ddData.activeTab = tabProp;
      }
    }
  }

  private handleScheduleResponse(res, year?) {
    this.teamSchedule = res;
    this.params.year = year || this.scheduleService.getPreSelectedTeamSeason() ||
      this.nbaService.getDefaultSeason(this.teamSchedule.seasons_dropdown);
    this.scheduleService.removePreSelectedTeamSeason();

    this.finishedGames = new IsBeforeAfterPipe().transform(this.teamSchedule.schedule, false, 'date_time');
    this.notPlayedGames = new IsBeforeAfterPipe().transform(this.teamSchedule.schedule, true, 'date_time');
    this.title.setTitle(this.teamSchedule.page_title);
    // const isDefaultSeason = this.nbaService.checkIfDefaultSeason(this.params.year, this.teamSchedule.seasons_dropdown);
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NBA', url: '/nba'},
      {label: 'Teams', url: '/nba/teams'},
      {label: 'Schedule', url: '/nba/schedule'},
      {
        label: this.nbaService.handleYear(this.params.year),
        url: `/nba/schedule`,
        key: `/nba/schedule/year`
      },
      {
        label: this.teamSchedule.heading,
        url: `/nba/schedule/${this.params.team_name}`
      }
    ]);
  }
}
