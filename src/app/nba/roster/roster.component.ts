import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { NbaService } from '../nba.service';
import { DropdownService } from '../../shared/components/dropdown/dropdown.service';
import { TitleService } from '../../shared/services/title.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { RosterService } from './roster.service';
import { TeamLineupService } from '../team-lineup/team-lineup.service';
import { CommonService } from '../../shared/services/common.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit, OnDestroy {
  teamNameValue: string;
  activeYear;
  pageNavOpen: boolean;
  rosterData: any;
  orderByPosition: string[] = ['PG', 'SG', 'SF', 'PF', 'C'];
  ddData: any;
  sortByPosition = this.orderByPositionFn.bind(this);

  sortBy: any;
  sortOrder: string;

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private dropdownService: DropdownService,
    private nbaService: NbaService,
    private teamLineupService: TeamLineupService,
    private spinnerService: SpinnerService,
    private rosterService: RosterService,
    private commonService: CommonService,
    private meta: Meta,
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

  ngOnDestroy() {
    this.meta.removeTag('name="description"');
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

  handleYear(year) {
    return this.nbaService.handleYear(year);
  }

  private orderByPositionFn(game) {
    return [this.orderByPosition.indexOf(game.position), parseInt(game.depth_chart_order, 10) || 99999];
  }

  private handleRosterResponse(res, year?) {
    this.rosterData = res;
    this.rosterData.roster = this.rosterData.roster.map(this.commonService.handleEmptyObjectValues);
    this.activeYear = year || this.rosterService.getPreSelectedTeamSeason() ||
      this.nbaService.getDefaultSeason(this.rosterData.seasons_dropdown);
    this.rosterService.removePreSelectedTeamSeason();
    this.orderByPosition = _.union(this.orderByPosition, _.uniq(this.rosterData.roster.map(player => player.position)));
    const isDefaultSeason = this.nbaService.checkIfDefaultSeason(this.activeYear, this.rosterData.seasons_dropdown);
    if (this.rosterData.meta) {
      this.meta.removeTag('name="description"');
      this.meta.addTag({ name: 'description', content: this.rosterData.meta });
    }
    if (this.rosterData.page_title) {
      this.title.setTitle(this.rosterData.page_title);
    } else {
      this.title.setTitle(`${this.rosterData.nav.team_name_full} ${this.activeYear} Roster`);
    }
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NBA', url: '/nba'},
      {label: 'Teams', url: '/nba/teams'},
      {label: 'Rosters', url: '/nba/rosters'},
      {
        label: this.nbaService.handleYear(this.activeYear),
        url: isDefaultSeason ? '/nba/rosters' : '/nba',
        key: isDefaultSeason ? null : '/nba/year',
        year: this.activeYear
      },
      {
        label: this.rosterData.heading,
        url: `/nba/roster/${this.teamNameValue}`
      }
    ]);
  }

}
