import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../schedule.service';
import { ActivatedRoute, Params } from '@angular/router';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { IsBeforeAfterPipe } from '../../../shared/pipes/isBeforeAfter.pipe';
import { CommonService } from '../../../shared/services/common.service';
import { MlbService } from '../../mlb.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { TitleService } from '../../../shared/services/title.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import * as _ from 'lodash';

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
  isDefaultSeason: boolean;
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
  constructor(
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private mlbService: MlbService,
    private commonService: CommonService,
    private dropdownService: DropdownService,
    private spinnerService: SpinnerService,
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
    if (parseInt(this.params.year, 10) === parseInt(season.year, 10)) {
      return;
    }
    this.spinnerService.handleAPICall(this.scheduleService.getTeamSchedule(this.params.team_name, season.year))
      .subscribe(res => {
        this.handleScheduleResponse(res, season.year);
      });
  }

  sortMatchups(game) {
    return `${game.away_lineup} at ${game.away_lineup}`;
  }

  sortLineup(compareKeyOne: string, compareKeyTwo: string, ifTrue: string, ifFalse: string,  game) {
    return game[compareKeyOne] === game[compareKeyTwo] ? game[ifTrue] : game[ifFalse];
  }

  onDropdownChange() {
    this.ddData.activeTab = this.commonService.getActiveCheckBoxItems(this.ddData.tabs, 'prop')[0];
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

  performActionOnBreadcrumbClick(breadcrumb) {
    if (breadcrumb.key && _.includes(breadcrumb.key, '/mlb/schedule/')) {
      switch (this.params.year.toString()) {
        case '2017': {
          this.scheduleService.setPreSelectedDate(`04-02-${this.params.year}`);
          break;
        }
        case '2018': {
          this.scheduleService.setPreSelectedDate(`03-29-${this.params.year}`);
          break;
        }
      }
    }
  }

  private handleScheduleResponse(res, year?) {
    this.teamSchedule = res;
    this.params.year = year || this.scheduleService.getPreSelectedTeamSeason() ||
      this.mlbService.getDefaultSeason(this.teamSchedule.seasons_dropdown);
    this.scheduleService.removePreSelectedTeamSeason();
    this.finishedGames = new IsBeforeAfterPipe().transform(this.teamSchedule.data, false, 'date_time');
    this.notPlayedGames = new IsBeforeAfterPipe().transform(this.teamSchedule.data, true, 'date_time');
    this.isDefaultSeason = this.mlbService.checkIfDefaultSeason(this.params.year, this.teamSchedule.seasons_dropdown);
    this.title.setTitle(this.teamSchedule.page_title);
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'MLB', url: '/mlb'},
      {label: 'Teams', url: '/mlb/teams'},
      {label: 'Schedule', url: '/mlb/schedule'},
      {
        label: this.params.year,
        url: `/mlb/schedule`,
        key: `/mlb/schedule/`
      },
      {
        label: this.teamSchedule.heading,
        url: `/mlb/schedule${this.isDefaultSeason ? '' : '/' + this.params.year}/${this.params.team_name}`
      }
    ]);
  }
}
