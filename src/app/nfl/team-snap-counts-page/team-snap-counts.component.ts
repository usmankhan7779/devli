import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';
import { TeamSnapCountsService } from './team-snap-counts.service';
import { NflService } from '../nfl.service';
import { DropdownService } from '../../shared/components/dropdown/dropdown.service';
import { CommonService } from '../../shared/services/common.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-team-snap-counts',
  templateUrl: './team-snap-counts.component.html',
  styleUrls: ['./team-snap-counts.component.scss']
})
export class TeamSnapCountsComponent implements OnInit {
  isCollapsed: boolean;
  dropdownCollapsed: boolean;
  isDefaultSeason: boolean;
  data;
  playersData;
  // currentPage = 1;
  ddData: any;
  pageTitle;
  params: {
    team_name: string
    year?: string
  };

  readonly snapPositionList = {
    offense: ['qb', 'wr', 'fb', 'rb', 'te'],
    k: ['k', 'p'],
    rb: ['fb', 'rb'],
    ol: ['ot', 'c', 'g', 'rt', 'rg', 'lt', 'lg', 'ol'],
    def: ['db', 'rcb', 'lcb', 'olb', 'rolb', 'mlb', 'dl', 'rdt', 'ldt', 'rde', 'lde', 'ilb', 'fs', 'cb', 'dt', 'de', 'ss']
  };

  constructor(
    private title: TitleService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private nflService: NflService,
    private dropdownService: DropdownService,
    private spinnerService: SpinnerService,
    private commonService: CommonService,
    private teamSnapCountsService: TeamSnapCountsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.params = {
        team_name: params.team_name,
      };
      this.handleResponse(this.route.snapshot.data['pageData']);
    });
  }

  getActiveTab(getAsName = false) {
    for (const key in this.ddData.tabs) {
      if (this.ddData.tabs.hasOwnProperty(key) && this.ddData.tabs[key]) {
        if (getAsName) {
          return key === 'all' ? 'All' : key.toUpperCase();
        }
        return key;
      }
    }
    return null;
  }

  onYearDdChange(season) {
    this.spinnerService.handleAPICall(this.teamSnapCountsService.getTeamSnapCounts(this.params.team_name, season.year))
      .subscribe(res => {
        this.handleResponse(res, season.year);
      });
  }

  handleYear(year) {
    return this.nflService.handleYear(year);
  }

  onSnapCountBtnClick(position) {
    for (const key in this.ddData.tabs) {
      if (this.ddData.tabs.hasOwnProperty(key) && this.ddData.tabs[key]) {
        this.ddData.tabs[key] = false;
      }
    }
    this.ddData.tabs[position] = true;
    return this.playersData = this.data.data.filter(player => {
      if (this.snapPositionList.hasOwnProperty(position.toLowerCase())) {
        return _.includes(this.snapPositionList[position.toLowerCase()], player.position.toLowerCase());
      }
      return player.position.toLowerCase() === position.toLowerCase();
    });
  }

  onDdChange() {
    this.ddData.activeSeasonType = this.commonService.getActiveCheckBoxItems(this.ddData.seasonTypeDropdown, 'id')[0];
    this.spinnerService.handleAPICall(this.teamSnapCountsService.getTeamSnapCounts(this.params.team_name, this.params.year, {
      season_type:  this.ddData.activeSeasonType
    })).subscribe(res => {
      this.data.data = res.data;
      this.onSnapCountBtnClick(this.getActiveTab());
    });
  }

  private handleResponse(data, year?) {
    this.data = data;
    this.params.year = year || this.teamSnapCountsService.getPreSelectedTeamSeason() || this.data.nav.matchup_season;
    this.teamSnapCountsService.removePreSelectedTeamSeason();
    this.ddData = this.teamSnapCountsService.getDDdObject(this.data.season_type_dropdowns);
    this.isDefaultSeason = this.nflService.checkIfDefaultSeason(this.params.year, this.data.seasons_dropdown);
    this.ddData.seasons = this.data.seasons_dropdown;

    this.onSnapCountBtnClick('offense'); // set playersData

    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NFL', url: '/nfl'},
      {label: 'Players', url: '/nfl/players'},
      {label: 'NFL Player Stats', url: '/nfl/player-stats'},
      {label: 'NFL Snap Counts', url: '/nfl/snap-counts'},
      {label: this.data.heading, url: './'},
    ]);
    this.title.setTitle(this.data.page_title);
  }

}
