import { Component, OnDestroy, OnInit } from '@angular/core';
import {TeamLineupService} from '../team-lineup.service';
import {ActivatedRoute, Router} from '@angular/router';
import { MlbService } from '../../mlb.service';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { SchemaService } from '../../../shared/services/schema.service';
import * as _ from 'lodash';
import { CommonService } from '../../../shared/services/common.service';
import { Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-current-team-lineup',
  templateUrl: './current-team-lineup.component.html',
  styleUrls: ['./current-team-lineup.component.scss']
})
export class CurrentTeamLineupComponent implements OnInit, OnDestroy {
  // Pitchers sorting Start
  sortByPitchers: any;
  sortOrderPitchers: any;
  // Pitchers sorting End

  // Hitters sorting Start
  sortByHitters: any;
  sortOrderHitters: any;
  // Hitters sorting End

  // HittersBench sorting Start
  sortByHittersBench: any;
  sortOrderHittersBench: any;
  // HittersBench sorting End

  teamLineup: any;
  teamNameValue: string;
  teamNameBreadcrumb: string;
  dropdownCollapsed: boolean;
  isDefaultSeason: boolean;
  // Lineups Stat Table Button States
  bullpenTableActive = false;
  benchTableActive = false;
  // Page Year Value
  activeYear: number;

  // Header Area Btn Groups
  btnGroupOneCurrentValue: any;
  btnGroupTwoCurrentValue: any;
  btnGroupThreeCurrentValue: any;
  btnGroupFantasyCurrentValue: any;
  btnGroupOneOpts = [
    {
      label: 'Stats',
      id: 1
    },
    {
      label: 'Fantasy',
      id: 2
    }
  ];
  btnGroupTwoOpts = [
    {
      label: 'Both',
      id: 'season'
    },
    {
      label: 'vs. Left',
      id: 'left'
    },
    {
      label: 'vs. Right',
      id: 'right'
    },
  ];
  btnGroupThreeOpts = [
    {
      label: 'Season',
      id: 1
    },
    {
      label: 'Last 10',
      allowBothOnly: true,
      id: 2
    },
    {
      label: 'Last 30',
      allowBothOnly: true,
      id: 3
    },
    {
      label: 'Last 60',
      allowBothOnly: true,
      id: 4
    },
    {
      label: 'Advanced Stats',
      id: 5
    }
  ];

  btnGroupFantasyOpts = [
    {
      label: 'FanDuel',
      id: 1
    },
    {
      label: 'DraftKings',
      id: 2
    },
    {
      label: 'Yahoo',
      id: 3
    }
  ];

  startingPlayers: any[];

  constructor(
    private router: Router,
    private teamLineupService: TeamLineupService,
    private route: ActivatedRoute,
    private mlbService: MlbService,
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService,
    private schemaService: SchemaService,
    private meta: Meta,
    private spinnerService: SpinnerService,
  ) {
    // Set Dropdown Values
    this.btnGroupOneCurrentValue = this.btnGroupOneOpts[0];
    this.btnGroupTwoCurrentValue = this.btnGroupTwoOpts[0];
    this.btnGroupThreeCurrentValue = this.btnGroupThreeOpts[0];
    this.btnGroupFantasyCurrentValue = this.btnGroupFantasyOpts[0];
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamNameValue = params['team_name'];
      this.handleResponse(this.route.snapshot.data['teamLineup']);
    });
  }

  ngOnDestroy() {
    this.meta.removeTag('name="description"');
  }

  onYearDdChange(season) {
    this.spinnerService.handleAPICall(this.teamLineupService.mlbTeamLineup(this.teamNameValue, season.year))
      .subscribe(res => {
        this.handleResponse(res, season.year, true);
      });
  }

  handleResponse(data, year?, changeParentData?) {
    if (changeParentData) {
      this.teamLineupService.changeIndTeamData(data, year);
    }
    this.teamLineup = data;
    this.activeYear = year || this.teamLineupService.getPreSelectedTeamSeason() ||
      this.mlbService.getDefaultSeason(this.teamLineup.seasons_dropdown);
    this.teamLineupService.removePreSelectedTeamSeason();
    console.log(this.teamLineup);
    if (this.teamLineup.meta) {
      this.meta.removeTag('name="description"');
      this.meta.addTag({ name: 'description', content: this.teamLineup.meta });
    }
    this.isDefaultSeason = this.mlbService.checkIfDefaultSeason(this.activeYear, this.teamLineup.seasons_dropdown);
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'MLB', url: '/mlb'},
      {label: 'Teams', url: '/mlb/teams'},
      {label: 'Lineups', url: '/mlb/lineups'},
      {
        label: this.activeYear,
        url: '/mlb',
        key: this.isDefaultSeason ? null : '/mlb/year',
        year: this.activeYear
      },
      {
        label: this.teamLineup.heading,
        url: `/mlb/lineups/${this.teamNameValue}`
      }
    ]);
    // Sort Hitters by Batting Order
    if (this.teamLineup.starting_hitters && this.teamLineup.starting_hitters.length) {
      this.teamLineup.starting_hitters.sort((a, b) => {
        if (a.batting_order < b.batting_order) {
          return -1;
        }
        if (a.batting_order > b.batting_order) {
          return 1;
        }
        return 0;
      });
    } else {
      this.teamLineup.starting_hitters = [];
    }
    if (!this.teamLineup.bench_hitters || !this.teamLineup.bench_hitters.length) {
      this.teamLineup.bench_hitters = [];
    }
    const startingPlayers = this.teamLineup.starting_hitters.slice(0);
    startingPlayers.unshift(this.teamLineup.starting_pitcher);
    this.startingPlayers = startingPlayers;
    this.setSchema();
  }

  // UI Functions
  // --------------
  /**
   *  Open/Close Bullpen Table - onOpenBullpenTable()
   *  -----------------------------------------------
   */
  onOpenBullpenTable() {
    this.bullpenTableActive = !this.bullpenTableActive;
  }

  /**
   *  Open/Close Bullpen Table - onOpenBullpenTable()
   *  -----------------------------------------------
   */
  onOpenBenchTable() {
    this.benchTableActive = !this.benchTableActive;
  }

  onSelectBtnGroupOneOpt(opt) {
    this.btnGroupOneCurrentValue = opt;
  }

  onSelectBtnGroupTwoOpt(opt) {
    this.btnGroupTwoCurrentValue = opt;
  }

  onSelectBtnGroupThreeOpt(opt) {
    this.btnGroupThreeCurrentValue = opt;
  }

  onSelectBtnGroupFantasyOpt(opt) {
    this.btnGroupFantasyCurrentValue = opt;
  }

  onSortOrder(sortBy, sortOrder, mode, $event) {
    if (mode === 'by') {
      this[sortBy] = $event;
    } else if (mode === 'order') {
      this[sortOrder] = $event;
    }
  }

  private setSchema() {
    this.schemaService.addSchema([{
      '@context': 'http://schema.org',
      '@type': 'SportsTeam',
      'name': this.teamLineup.nav.team_name_full,
      'sport': 'Baseball',

      'url': `https://www.lineups.com${this.teamLineup.nav.team_lineup_route}`,

      'memberOf': [
        {
          '@type': 'SportsOrganization',
          'name': 'MLB'
        },{
          '@type': 'SportsOrganization',
          'name': this.teamLineup.nav.team_league,
        },{
          '@type': 'SportsOrganization',
          'name': `${this.teamLineup.nav.team_league} ${this.teamLineup.nav.team_division}`
        }
      ],
      'member': this.generateMembers()
    }, this.commonService.generateDatasetSchema(
      `${this.teamLineup.nav.team_name_full} starting lineup`,
      // tslint:disable-next-line:max-line-length
      `${this.teamLineup.nav.team_name_full} team lineup. Player names on team lineup, starting lineup, bench players, player stats, most common lineups.`,
      `${this.teamLineup.nav.team_name_full} starting lineup, team name players, team name stats`,
      `https://www.lineups.com${this.teamLineup.nav.team_lineup_route}`,
      `Dataset`
    )]);
  }

  private generateMembers() {
    let players = _.concat(
      this.teamLineup.starting_hitters,
      this.teamLineup.starting_pitcher,
      this.teamLineup.bench_hitters,
      this.teamLineup.bench_pitchers
    ).filter(player => !!player);
    players = _.uniqBy(players, 'profile_url');
    return players.map(player => {
      return {
        '@type': 'OrganizationRole',
        'member': {
          '@type': 'Person',
          'name': player.name,
          'url': 'https://www.lineups.com' + player.profile_url,
        },
        'roleName': player.position
      }
    });
  }

}
