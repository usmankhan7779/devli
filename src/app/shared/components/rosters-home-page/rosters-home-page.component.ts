import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, Params } from '@angular/router';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';
import * as _ from 'lodash';
import { NflService } from '../../../nfl/nfl.service';
import { NbaService } from '../../../nba/nba.service';
import { DropdownService } from '../dropdown/dropdown.service';
import { TitleService } from '../../services/title.service';
import * as NFLRosterService from '../../../nfl/roster/roster.service';
import * as MLBRosterService from '../../../mlb/roster/roster.service';
import * as NBARosterService from '../../../nba/roster/roster.service';
import * as CFBRosterService from '../../../college-football/roster/roster.service';
import { CollegeFootballService } from '../../../college-football/college-football.service';
import { SchemaService } from '../../services/schema.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-rosters-home-page',
  templateUrl: './rosters-home-page.component.html',
  styleUrls: ['./rosters-home-page.component.scss']
})
export class RostersHomePageComponent implements OnInit, OnDestroy {
  data;
  rostersToShow;
  dropdowns;
  currentLeague: string;
  currentYear: number;

  @ViewChild('searchInput', {static: false}) searchInput;

  private rosterService: NFLRosterService.RosterService |
    MLBRosterService.RosterService | NBARosterService.RosterService | any;
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private title: TitleService,
    private nflService: NflService,
    private nbaService: NbaService,
    private meta: Meta,
    private collegeFootballService: CollegeFootballService,
    private dropdownService: DropdownService,
    private breadcrumbService: BreadcrumbService,
    private schemaService: SchemaService,
    private mlbRosterService: MLBRosterService.RosterService,
    private nbaRosterService: NBARosterService.RosterService,
    private nflRosterService: NFLRosterService.RosterService,
    private cfbRosterService: CFBRosterService.RosterService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const data = this.route.snapshot.data['rosters'];
      if (data.meta) {
        this.meta.removeTag('name="description"');
        this.meta.addTag({ name: 'description', content: data.meta });
      }
      this.currentLeague = this.route.snapshot.data['league'].toLowerCase();
      switch (this.currentLeague) {
        case 'mlb': {
          this.rosterService = this.mlbRosterService;
          break;
        }
        case 'nfl': {
          this.rosterService = this.nflRosterService;
          break;
        }
        case 'nba': {
          this.rosterService = this.nbaRosterService;
          break;
        }
        case 'college-football': {
          this.rosterService = this.cfbRosterService;
          break;
        }
      }
      this.handleRostersResponse(this.getPreSelectedSeason() || 'current', data);
    });
  }

  ngOnDestroy() {
    this.meta.removeTag('name="description"');
  }

  onYearDdChange(season) {
    this.getRosters(season.year);
  }

  displayCurrentYearDD(year) {
    switch (this.currentLeague) {
      case 'nfl': {
        return this.nflService.handleYear(year);
      }
      case 'nba': {
        return this.nbaService.handleYear(year);
      }
      default: {
        return year;
      }
    }
  }

  onUrlClicked() {
    switch (this.currentLeague) {
      case 'college-football': {
        return this.collegeFootballService.setPreSelectedSeason(this.currentYear);
      }
      default: {
        this.rosterService.setPreSelectedTeamSeason(this.currentYear);
      }
    }
  }

  getPreSelectedSeason() {
    switch (this.currentLeague) {
      case 'college-football': {
        return this.collegeFootballService.getPreSelectedSeason();
      }
      default: {
        this.rosterService.getPreSelectedTeamSeason();
      }
    }
  }

  private getRosters(year) {
    this.rosterService.getRosterRoutes(year)
      .subscribe(this.handleRostersResponse.bind(this, year));
  }

  private handleRostersResponse(year, data) {
    const breadcrumbs = [
      {
        url: `/${this.currentLeague}`,
        label: this.currentLeague.toUpperCase()
      },
      {
        url: `/${this.currentLeague}/teams`,
        label: 'Teams'
      },
      {
        url: `/${this.currentLeague}/rosters`,
        label: 'Rosters'
      }
    ];
    if (year === 'current') {
      this.currentYear = (<{name: string, year: number, default: boolean}>_.find(data.seasons_dropdown, { default: true })).year;
    } else {
      this.currentYear = parseInt(year, 10);
    }
    if (this.currentLeague === 'college-football') {
      breadcrumbs.shift();
      breadcrumbs.unshift({
        url: `/college-football`,
        label: 'CFB'
      });
      data.white_logos = _.mapValues(_.keyBy(data.teams, 'full_name'), 'logo');
    }
    data.roster_routes = this.commonService.createArrayFromNamedObj(data.roster_routes, 'name', 'url',
      [
        {obj: data.white_logos, prop: 'white_logo'},
        {obj: data.primary_hex, prop: 'primary_hex'},
        {obj: data.secondary_hex, prop: 'secondary_hex'}
      ]);
    this.title.setTitle(data.page_title);
    this.breadcrumbService.changeBreadcrumbs(breadcrumbs);
    this.data = data;
    this.commonService.sortYearArr(this.data.seasons_dropdown);
    this.rostersToShow = this.data.roster_routes.slice(0);
    this.setSchema(this.rostersToShow);
    if (this.searchInput && this.searchInput.clearSearchModel) {
      this.searchInput.clearSearchModel();
    }
  }

  filterByName(filterVal) {
    return this.data.roster_routes.filter((item) => {
      return item.name.toLowerCase().indexOf(filterVal.toLowerCase()) !== -1;
    });
  }

  updateTeams(filtered) {
    this.rostersToShow = filtered;
  }

  private setSchema(rostersToShow) {
    if (this.currentLeague === 'college-football') {
      return;
    }
    const league = this.currentLeague.toUpperCase();
    this.schemaService.addSchema([
      this.commonService.generateDatasetSchema(
        `${league} Rosters`,
        `The ${league} roster page includes a list of all ${league} team roster pages with links to the team specific roster pages.`,
        `${league} rosters,
         ${league} team rosters,
          ${league} rosters ${league === 'NBA' ?
          (<any>_.find(this.data.seasons_dropdown, 'default')).name :
          (<any>_.find(this.data.seasons_dropdown, 'default')).year + 1}`,
        `https://www.lineups.com/${this.currentLeague}/rosters`,
        'Dataset'
      ),
      this.generateTeamSchema(rostersToShow)
    ]);
  }

  private generateTeamSchema(rostersToShow) {
    return {
      '@context': 'http://schema.org',
      '@type': 'SportsOrganization',
      'name': this.currentLeague.toUpperCase(),
      'sport': this.schemaService.getSportType(this.currentLeague),
      'url': `https://www.lineups.com/${this.currentLeague}/rosters`,
      'members': rostersToShow.map((teamData) => {
        return     {
          '@type': 'SportsTeam',
          'name': teamData.name,
          'url': `https://www.lineups.com${teamData.url}`
        }
      })
    }
  }
}
