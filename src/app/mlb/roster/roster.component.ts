import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RosterService } from './roster.service';
import * as _ from 'lodash'
import { DropdownService } from '../../shared/components/dropdown/dropdown.service';
import { MlbService } from '../mlb.service';
import { TitleService } from '../../shared/services/title.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { CommonService } from '../../shared/services/common.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit, OnDestroy {
  teamNameValue: string;
  pageTitle: string;
  activeYear;
  pageNavOpen: boolean;
  isDefaultSeason: boolean;
  rosterData: any;
  ddData;
  orderByPosition: any[] = ['SP', 'RP', 'C', '1B', '2B', '3B', 'SS', 'RF', 'CF', 'LF'];

  sortByPosition = this.orderByPositionFn.bind(this);

  sortBy: any;
  sortOrder: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private dropdownService: DropdownService,
    private rosterService: RosterService,
    private spinnerService: SpinnerService,
    private mlbService: MlbService,
    private commonService: CommonService,
    private meta: Meta,
    private title: TitleService
  ) { }

  ngOnInit() {
    this.sortBy = this.sortByPosition;
    this.sortOrder = 'asc';
    this.route.params.subscribe(params => {
      this.teamNameValue = params['team_name'];
      this.handleRosterResponse(this.route.snapshot.data['rosterData']);
    });
  }

  ngOnDestroy() {
    this.meta.removeTag('name="description"');
  }

  onYearDdChange(season) {
    this.spinnerService.handleAPICall(this.rosterService.getRoster(this.teamNameValue, season.year))
      .subscribe(res => {
        this.handleRosterResponse(res, season.year);
      });
  }

  private handleRosterResponse(res, year?) {
    this.rosterData = res;
    this.rosterData.players = this.rosterData.players.map(this.commonService.handleEmptyObjectValues);
    this.activeYear = year || this.rosterService.getPreSelectedTeamSeason() ||
      this.mlbService.getDefaultSeason(this.rosterData.seasons_dropdown);

    this.rosterService.removePreSelectedTeamSeason();
    this.orderByPosition = _.union(this.orderByPosition, _.uniq(this.rosterData.players.map(player => player.position)));
    this.isDefaultSeason = this.mlbService.checkIfDefaultSeason(this.activeYear, this.rosterData.seasons_dropdown);
    this.pageTitle = this.rosterData.heading;
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
      {label: 'MLB', url: '/mlb'},
      {label: 'Teams', url: '/mlb/teams'},
      {label: 'Rosters', url: '/mlb/rosters'},
      {
        label: this.activeYear,
        url: this.isDefaultSeason ? '/mlb/rosters' : '/mlb',
        key: this.isDefaultSeason ? null : '/mlb/year',
        year: this.activeYear
      },
      {
        label: this.pageTitle,
        url: `/mlb/roster/${this.teamNameValue}`
      }
    ]);
  }

  private orderByPositionFn(game) {
    return [this.orderByPosition.indexOf(game.position), 100 - (game.lineups_rating || 0)];
  }

  performActionOnBreadcrumbClick(breadcrumb) {
    if (breadcrumb.key && breadcrumb.key === '/mlb/year' && breadcrumb.year) {
      this.mlbService.setPreSelectedGatewaySeason(breadcrumb.year);
    }
  }

}
