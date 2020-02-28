import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { RosterService } from './roster.service';
import * as _ from 'lodash'
import { CommonService } from '../../shared/services/common.service';
import { NflService } from '../nfl.service';
import { DropdownService } from '../../shared/components/dropdown/dropdown.service';
import { TitleService } from '../../shared/services/title.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { SchemaService } from '../../shared/services/schema.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit, OnDestroy {
  teamNameValue: string;
  pageTitle: string;
  activeYear: string;
  pageNavOpen: boolean;
  isDefaultYear: boolean;
  ddData: any;
  rosterData: any;
  orderByPosition: any[] = ['QB', 'RB', 'WR', 'TE', 'DE', 'FB', 'CB', 'NT', 'G', 'K', 'OT', 'ILB', 'OLB', 'SS', 'P', 'FS', 'LS', 'C', 'DT'];

  sortByPosition = this.orderByPositionFn.bind(this);

  sortBy: any;
  sortOrder: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private dropdownService: DropdownService,
    private commonService: CommonService,
    private spinnerService: SpinnerService,
    private nflService: NflService,
    private rosterService: RosterService,
    private schemaService: SchemaService,
    private title: TitleService,
    private meta: Meta
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

  handleYear(year) {
    return this.nflService.handleYear(year);
  }

  performActionOnBreadcrumbClick(breadcrumb) {
    if (breadcrumb.key && breadcrumb.key === '/nfl/year' && breadcrumb.year) {
      this.nflService.setPreSelectedGatewaySeason(breadcrumb.year);
    }
  }

  private handleRosterResponse(res, year?) {
    this.rosterData = res;

    this.rosterData.data = this.rosterData.data.map(this.commonService.handleEmptyObjectValues);

    this.activeYear = year || this.rosterService.getPreSelectedTeamSeason() ||
      this.nflService.getDefaultSeason(this.rosterData.seasons_dropdown);

    this.rosterService.removePreSelectedTeamSeason();

    if (this.rosterData.meta) {
      this.meta.removeTag('name="description"');
      this.meta.addTag({ name: 'description', content: this.rosterData.meta });
    }

    this.orderByPosition = _.union(this.orderByPosition, _.uniq(this.rosterData.data.map(player => player.position)));
    this.isDefaultYear = this.nflService.checkIfDefaultSeason(this.activeYear, this.rosterData.seasons_dropdown);
    this.pageTitle = this.rosterData.heading;
    if (this.rosterData.page_title) {
      this.title.setTitle(this.rosterData.page_title);
    } else {
      this.title.setTitle(`${this.rosterData.nav.team_name_full} ${this.activeYear} Roster`);
    }
    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      this.pageTitle,

      `${this.rosterData.nav.team_name_full} full team roster.` +
      'Player names on the team roster, player rating, player number,' +
      ' player position, player school, player height and weight, draft year.',

      `${this.rosterData.nav.team_name_full} roster, ` +
      `${this.rosterData.nav.team_name_full} team roster, ` +
      `${this.rosterData.nav.team_name_full} team players`,

      `https://www.lineups.com${this.rosterData.nav.team_roster_route}`,

      'Dataset'
    ),
      {
        '@context': 'http://schema.org',
        '@type': 'SportsTeam',
        'name': this.rosterData.nav.team_name_full,
        'sport': 'American Football',

        'description': `${this.rosterData.nav.team_name_full} roster, ` +
        `${this.rosterData.nav.team_name_full} team roster, ` +
        `${this.rosterData.nav.team_name_full} team players`,

        'url': `https://www.lineups.com${this.rosterData.nav.team_roster_route}`,

        'memberOf': [
          {
            '@type': 'SportsOrganization',
            'name': 'NFL'
          },{
            '@type': 'SportsOrganization',
            'name': this.rosterData.nav.team_conference,
          },{
            '@type': 'SportsOrganization',
            'name': `${this.rosterData.nav.team_conference} ${this.rosterData.nav.team_division}`
          }
        ],
        'member': this.rosterData.data.map((player => {
          return {
            '@type': 'OrganizationRole',
            'member': {
              '@type': 'Person',
              'name': player.name,
              'url': 'https://www.lineups.com' + player.profile_url,
            },
            'roleName': player.position
          }
        }))
      }
    ]);

    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NFL', url: '/nfl'},
      {label: 'Teams', url: '/nfl/teams'},
      {label: 'Rosters', url: '/nfl/rosters'},
      {
        label: this.nflService.handleYear(this.activeYear),
        url: this.isDefaultYear ? '/nfl/rosters' : '/nfl',
        key: this.isDefaultYear ? null : '/nfl/year',
        year: this.activeYear
      },
      {
        label: this.pageTitle,
        url: `/nfl/roster/${this.teamNameValue}`
      }
    ]);
  }

  private orderByPositionFn(game) {
    return [this.orderByPosition.indexOf(game.position), parseInt(game.depth_order, 10) || 99999];
  }
}
