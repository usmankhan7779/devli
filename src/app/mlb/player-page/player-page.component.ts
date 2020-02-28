import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Params } from '@angular/router';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { CommonService } from '../../shared/services/common.service';
import { PlayerPageService } from './player-page.service';
import { ShowPercentagePipe } from '../../shared/pipes/show-percentage.pipe';
import { isPlatformBrowser } from '@angular/common';
import { TitleService } from '../../shared/services/title.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { MlbService } from '../mlb.service';
import { SchemaService } from '../../shared/services/schema.service';
import * as _ from 'lodash';
import { VideoDataService } from '../../shared/services/videoData.service';

@Component({
  selector: 'app-player-page',
  templateUrl: './player-page.component.html',
  styleUrls: ['./player-page.component.scss'],
  providers: [ShowPercentagePipe]
})
export class PlayerPageComponent implements OnInit {
  playerData;
  ddData;
  windowWidth: number;
  originTableHeaders: any;
  params: {
    id?: string,
    name: string
  };
  activeYear: number;
  sortBy: any;
  sortOrder: string;
  csvShowed = false;
  csvTextLogs: string;
  csvTextStats: string;
  REPLACE_MOBILE = {
    'Fantasy Points Per Game': 'FPTS/G',
    'Fantasy Points': 'FPTS',
    'FanDuel': 'FD',
    'DraftKings': 'DK',
    'Yahoo': 'YA',
  };
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.windowWidth = event.target.innerWidth;
    if (this.windowWidth <= 575) {
      this.csvShowed = false;
    }
    if (this.playerData) {
      if (this.windowWidth <= 1020) {
        this.playerData.fantasy_header_map = this.handleTableHeaders(true, 'fantasy_header_map');
        this.playerData.game_logs_fantasy_header_map = this.handleTableHeaders(true, 'game_logs_fantasy_header_map');
      } else {
        this.playerData.fantasy_header_map = this.handleTableHeaders(false, 'fantasy_header_map');
        this.playerData.game_logs_fantasy_header_map = this.handleTableHeaders(false, 'game_logs_fantasy_header_map');
      }
    }
  }

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private playerPageService: PlayerPageService,
    private commonService: CommonService,
    private title: TitleService,
    private mlbService: MlbService,
    private spinnerService: SpinnerService,
    private schemaService: SchemaService,
    private showPercentagePipe: ShowPercentagePipe,
    private videoDataService: VideoDataService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.params = {
        id: params.id,
        name: params.name
      };
      this.handleApiResponse(this.route.snapshot.data['playerData']);
      if (this.route.snapshot.data['playerData'].team_lineups_route) {
        this.videoDataService.onAddScript(this.route.snapshot.data['playerData'].team_lineups_route);
      }
    });
  }

  onYearDdChange(season) {
    if (this.activeYear === parseInt(season.year, 10)) {
      return;
    }
    this.spinnerService.handleAPICall(this.playerPageService.getPlayer(this.params.id || this.params.name, season.year))
      .subscribe(res => {
        this.handleApiResponse(res, season.year);
      });
  }

  onDropdownChange() {
    this.ddData.activeBatter = this.commonService.getActiveCheckBoxItems(this.ddData.batter, 'prop')[0];
    this.ddData.activeBatterGame = this.commonService.getActiveCheckBoxItems(this.ddData.batterGame, 'prop')[0];
    this.ddData.activeMain = this.commonService.getActiveCheckBoxItems(this.ddData.main, 'prop')[0];
    this.ddData.activeMainGame = this.commonService.getActiveCheckBoxItems(this.ddData.mainGame, 'prop')[0];
    this.ddData.activeSecondary =  this.commonService.getActiveCheckBoxItems(this.ddData.secondary, 'prop')[0];
    this.ddData.activeTab =  this.commonService.getActiveCheckBoxItems(this.ddData.tabs, 'prop')[0];
    this.updateCSVText();
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

  onSortBy($event) {
    this.sortBy = $event;
  }

  onSortOrder($event) {
    this.sortOrder = $event;
  }

  onCsvShow() {
    this.csvShowed = !this.csvShowed;
  }

  private handleApiResponse(data, year?) {
    this.playerData = data;
    this.activeYear = year || this.mlbService.getDefaultSeason(this.playerData.seasons_dropdown);
    this.ddData = this.playerPageService.getDddObj(this.playerData.hitting_pitching_dropdown, this.playerData.is_pitcher);
    this.playerData.age = moment(this.playerData.birth_date).diff(moment(), 'years') * -1;

    this.originTableHeaders = {
      fantasy_header_map: {...this.playerData.fantasy_header_map},
      game_logs_fantasy_header_map: {...this.playerData.game_logs_fantasy_header_map}
    };
    if (this.playerData.page_title) {
      this.title.setTitle(this.playerData.page_title);
    } else {
      this.title.setTitle(`${this.playerData.full_name} Player Stats, Player News`);
    }

    const schemaObj = [{
      '@context': 'http://schema.org',

      '@type': 'Person',

      'name': this.playerData.full_name,

      'description': `${this.playerData.full_name} baseball player page. ${this.playerData.full_name} player stats, game logs, news.`,

      'url': 'https://www.lineups.com' +
      `/mlb/player-stats/${this.params.name}${this.params.id ? '/' + this.params.id : ''}`,

      'birthDate': this.playerData.birth_date,

      'jobTitle': this.playerData.position,

      'memberOf': [
        {
          '@type': 'SportsTeam',
          'name': this.playerData.full_team_name
        }
      ]
    }, this.commonService.generateDatasetSchema(
      this.playerData.full_name,
      `${this.playerData.full_name} baseball player page. ${this.playerData.full_name} player stats, game logs, news.`,
      `${this.playerData.full_name}, ${this.playerData.full_name} Stats, ${this.playerData.full_name} news`,
      'https://www.lineups.com' +
      `/mlb/player-stats/${this.params.name}${this.params.id ? '/' + this.params.id : ''}`,
      `Dataset`
    )];

    if (this.playerData.college) {
      schemaObj['alumniOf'] = {
        '@type': 'OrganizationRole',
        'alumniOf': {
          '@type': 'CollegeOrUniversity',
          'name': this.playerData.college
        }
      }
    }

    this.schemaService.addSchema(schemaObj);

    this.breadcrumbService.changeBreadcrumbs([
      {
        label: 'MLB',
        url: '/mlb'
      },
      {
        label: 'Players',
        url: '/mlb/players'
      },
      {
        label: 'MLB Player Stats',
        url: '/mlb/player-stats'
      },
      {
        label: this.playerData.heading || this.playerData.full_name,
        url: `/mlb/player-stats/${this.params.name}${this.params.id ? '/' + this.params.id : ''}`
      }
    ]);
    this.updateCSVText();
    if (isPlatformBrowser(this.platformId)) {
      this.onResize({
        target: {
          innerWidth: typeof window !== 'undefined' ? window.innerWidth : 768
        }
      });
    }
  }

  private updateCSVText() {
    this.csvTextStats = this.commonService.generateCSV(this.csvFormatStats(this.playerData));
    this.csvTextLogs = this.commonService.generateCSV(this.csvFormatLogs(this.playerData));
  }

  private csvFormatStats(data: any) {
    const resObj = {};
    if (this.ddData.activeMain === 'fantasy') {
      for (const header of data[this.ddData.activeMain + '_header_order']) {
        resObj[this.originTableHeaders[this.ddData.activeMain + '_header_map'][header]] =
          this.showPercentagePipe.transform(
            data[`${this.ddData.activeBatter}_stats`][this.ddData.activeMain][header],
            header);
      }
    } else {
      for (const header of data[this.ddData.activeMain + '_' + this.ddData.activeBatter + '_header_order']) {
        resObj[data[this.ddData.activeMain + '_' + this.ddData.activeBatter + '_header_map'][header]] =
          this.showPercentagePipe.transform(
            data[`${this.ddData.activeBatter}_stats`][this.ddData.activeMain][this.ddData.activeSecondary][header],
            header);
      }
    }
    return [resObj];
  }

  private csvFormatLogs(data: any) {
    return data[`${this.ddData.activeBatterGame}_game_logs`].map((obj) => {
      const resObj = {};
      resObj['Game'] = obj.game;
      resObj['Score'] = obj.game_score;
      if (this.ddData.activeMainGame === 'fantasy') {
        for (const header of data[`game_logs_${this.ddData.activeMainGame}_header_order`]) {
          resObj[this.originTableHeaders[`game_logs_${this.ddData.activeMainGame}_header_map`][header]] =
          this.showPercentagePipe.transform(obj[this.ddData.activeMainGame][header], header);
        }
      } else {
        for (const header of data[`game_logs_${this.ddData.activeMainGame}_${this.ddData.activeBatterGame}_header_order`]) {
          resObj[data[`game_logs_${this.ddData.activeMainGame}_${this.ddData.activeBatterGame}_header_map`][header]] =
            this.showPercentagePipe.transform(obj[this.ddData.activeMainGame][header], header);
        }
      }
      return resObj;
    });
  }

  private handleTableHeaders(isMobile, headerProp) {
    if (isMobile) {
      const headerMap = {
        ...this.originTableHeaders[headerProp]
      };
      for (const key in headerMap) {
        if (headerMap.hasOwnProperty(key)) {
          for (const replaceKey in this.REPLACE_MOBILE) {
            if (this.REPLACE_MOBILE.hasOwnProperty(replaceKey)) {
              if (_.includes(headerMap[key], replaceKey)) {
                headerMap[key] = headerMap[key].replace(replaceKey, this.REPLACE_MOBILE[replaceKey]);
              }
            }
          }
        }
      }
      return headerMap;
    }
    return this.originTableHeaders[headerProp];
  }

}
