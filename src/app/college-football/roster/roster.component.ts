import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { DropdownService } from '../../shared/components/dropdown/dropdown.service';
import { TitleService } from '../../shared/services/title.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { RosterService } from './roster.service';
import { TeamLineupService } from '../team-lineup/team-lineup.service';
import { CommonService } from '../../shared/services/common.service';
import { CollegeFootballService } from '../college-football.service';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit {
  teamNameValue: string;
  activeYear;
  pageNavOpen: boolean;
  rosterData: any;
  orderByPosition: string[] = ['QB', 'RB', 'WR', 'TE', 'FB'];
  ddData: any;
  sortByPosition = this.orderByPositionFn.bind(this);

  sortBy: any;
  sortOrder: string;

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private dropdownService: DropdownService,
    private collegeFootballService: CollegeFootballService,
    private teamLineupService: TeamLineupService,
    private spinnerService: SpinnerService,
    private rosterService: RosterService,
    private commonService: CommonService,
    private title: TitleService
  ) { }

  ngOnInit() {
    this.sortBy = this.sortByPosition;
    this.sortOrder = 'asc';
    this.route.params.subscribe(params => {
      this.teamNameValue = params['team_name'];
      this.handleRosterResponse(this.route.snapshot.data['data']);
    });
  }

  onYearDdChange(season) {
    this.spinnerService.handleAPICall(this.rosterService.getRoster(this.teamNameValue, season.year))
      .subscribe(res => {
        this.teamLineupService.changeTeamLineupYear(res, season.year);
        this.handleRosterResponse(res, season.year);
      });
  }

  onSortBy($event) {
    this.sortBy = $event;
  }

  onSortOrder($event) {
    this.sortOrder = $event;
  }

  private orderByPositionFn(game) {
    return this.orderByPosition.indexOf(game.position);
  }

  private handleRosterResponse(res, year?) {
    this.rosterData = res;
    this.rosterData.roster = this.rosterData.roster.map(this.commonService.handleEmptyObjectValues);
    this.activeYear = year || this.collegeFootballService.getPreSelectedSeason() ||
      this.collegeFootballService.getDefaultSeason(this.rosterData.seasons_dropdown);
    this.collegeFootballService.removePreSelectedSeason();
    this.orderByPosition = _.union(this.orderByPosition, _.uniq(this.rosterData.roster.map(player => player.position)));
    const isDefaultSeason = this.collegeFootballService.checkIfDefaultSeason(this.activeYear, this.rosterData.seasons_dropdown);
    if (this.rosterData.page_title) {
      this.title.setTitle(this.rosterData.page_title);
    } else {
      this.title.setTitle(`${this.rosterData.nav.team_name} ${this.activeYear} Roster`);
    }
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'CFB', url: '/college-football'},
      {label: 'Teams', url: '/college-football/teams'},
      {label: 'Rosters', url: '/college-football/rosters'},
      {
        label: this.activeYear,
        url: '/college-football/rosters',
        key: isDefaultSeason ? null : '/college-football/year',
        year: this.activeYear
      },
      {
        label: this.rosterData.heading,
        url: `/college-football/roster/${this.teamNameValue}`
      }
    ]);
  }
}
