import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import * as moment from 'moment';
import { CommonService } from '../../../shared/services/common.service';
import { NbaService } from '../../nba.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { TitleService } from '../../../shared/services/title.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { TeamLineupService } from '../team-lineup.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-current-team-lineup',
  templateUrl: './current-team-lineup.component.html',
  styleUrls: ['./current-team-lineup.component.scss']
})
export class CurrentTeamLineupComponent implements OnInit, OnDestroy {
  dropdownCollapsed: boolean;
  data;
  teamNameParam;
  activeYear;

  sortByStartersBench;
  sortOrderStartersBench;

  sortByStarters;
  sortOrderStarters;

  benchTableActive = false;
  isDefaultSeason: boolean;

  lineupDDs: any = {
    activeMain: 'basic',
    activeSecondary: 'per_game',
    main: [
      {
        name: 'Basic',
        prop: 'basic',
        selected: true
      },
      {
        name: 'Advanced',
        prop: 'advanced',
        selected: false
      },
      {
        name: 'Fantasy',
        prop: 'fantasy',
        selected: false
      }
    ],
    secondary: [
      {
        name: 'Per Game',
        prop: 'per_game',
        selected: true,
        hidden: false
      },
      {
        name: 'Per 100 Possessions',
        prop: 'per_100',
        selected: false,
        hidden: false
      },
      {
        name: 'Per 36 Minutes',
        prop: 'per_36',
        selected: false,
        hidden: false
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private title: TitleService,
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService,
    private dropdownService: DropdownService,
    private teamLineupService: TeamLineupService,
    private spinnerService: SpinnerService,
    private meta: Meta,
    private nbaService: NbaService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamNameParam = params['team_name'];
      this.handleResponse(this.route.snapshot.data['data']);
    });
  }

  onYearDdChange(season) {
    this.spinnerService.handleAPICall(this.teamLineupService.getTeamLineup(this.teamNameParam, season.year))
      .subscribe(res => {
        this.teamLineupService.changeTeamLineupYear(res, season.year);
        this.handleResponse(res, season.year);
      });
  }

  ngOnDestroy() {
    this.meta.removeTag('name="description"');
  }

  private handleResponse(data, year?) {
    this.data = data;
    this.activeYear = year || this.teamLineupService.getPreSelectedTeamSeason() ||
      this.nbaService.getDefaultSeason(this.data.seasons_dropdown);
    this.teamLineupService.removePreSelectedTeamSeason();
    this.data.advanced_headings = this.commonService.createArrayFromNamedObj(this.data.advanced_headings, 'name', 'prop');
    this.data.basic_headings = this.commonService.createArrayFromNamedObj(this.data.basic_headings, 'name', 'prop');
    this.data.fantasy_headings = this.commonService.createArrayFromNamedObj(this.data.fantasy_headings, 'name', 'prop');
    this.data.recent_lineups_headings = this.commonService.createArrayFromNamedObj(this.data.recent_lineups_headings, 'name', 'prop')
      .sort(function (a, b) {
        return +(!b.prop.localeCompare('result'));
      }).sort(function (a, b) {
        return +(!b.prop.localeCompare('game'));
      });


    this.equalsCommonLineups();

    this.isDefaultSeason = this.nbaService.checkIfDefaultSeason(this.activeYear, this.data.seasons_dropdown);
    this.title.setTitle(this.data.page_title);
    if (this.data.meta) {
      this.meta.removeTag('name="description"');
      this.meta.addTag({ name: 'description', content: this.data.meta });
    }
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NBA', url: '/nba'},
      {label: 'Teams', url: '/nba/teams'},
      {label: 'NBA Lineups', url: '/nba/lineups'},
      {
        label: this.nbaService.handleYear(this.activeYear),
        url: '/nba',
        key: this.isDefaultSeason ? null : '/nba/year',
        year: this.activeYear
      },
      {
        label: this.data.heading || `${this.data.nav.team_name_full} Starting Lineup ${this.activeYear}`,
        url: `/nba/lineups/${this.teamNameParam}`
      }
    ]);
  }

  onDropdownChange() {
    this.lineupDDs.activeMain = this.commonService.getActiveCheckBoxItems(this.lineupDDs.main, 'prop')[0];
    if (this.lineupDDs.activeMain === 'advanced') {
      this.lineupDDs.secondary.forEach(item => {
        item.hidden = item.prop !== 'per_game';
        item.selected = item.prop === 'per_game';
      });
    } else {
      this.lineupDDs.secondary.forEach(item => item.hidden = false);
    }
    this.lineupDDs.activeSecondary = this.commonService.getActiveCheckBoxItems(this.lineupDDs.secondary, 'prop')[0];
  }

  onSortOrder(sortBy, sortOrder, mode, $event) {
    if (mode === 'by') {
      this[sortBy] = $event;
    } else if (mode === 'order') {
      this[sortOrder] = $event;
    }
  }

  showRecentLineupsHeadings(name) {
    if (name === 'Game' || name === 'Result') {
      return name
    }
    return '';
  }

  private equalsCommonLineups() {
    let maxLength = 0;
    if (this.data.frequent_lineups && this.data.frequent_lineups.length) {
      for (const lineup of this.data.frequent_lineups) {
        if (maxLength < lineup.players.length) {
          maxLength = lineup.players.length;
        }
      }
      for (const lineup of this.data.frequent_lineups) {
        if (lineup.players.length < maxLength)  {
          lineup.players.length = maxLength;
        }
      }
    }
  }

}
