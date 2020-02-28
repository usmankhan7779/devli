import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import * as moment from 'moment';
import { SinglePlayerService } from './single-player.service';
import { CommonService } from '../../../shared/services/common.service';
import { ShowPercentagePipe } from '../../../shared/pipes/show-percentage.pipe';
import { isPlatformBrowser } from '@angular/common';
import { TitleService } from '../../../shared/services/title.service';
import { SchemaService } from '../../../shared/services/schema.service';
import * as _ from 'lodash';
import { WpSmBlogItemModel } from '../../../shared/components/wordpress/models/wp-sm-blog-item.model';
import { VideoDataService } from '../../../shared/services/videoData.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';

@Component({
  selector: 'app-single-player',
  templateUrl: './single-player.component.html',
  styleUrls: ['./single-player.component.scss'],
  providers: [ShowPercentagePipe]
})
export class SinglePlayerComponent implements OnInit {
  playerData;
  ddData;
  originTableHeaders: any;
  params: {
    id?: string,
    name: string
  };
  sortBy = 'date';
  sortOrder = 'desc';
  csvShowed = false;
  csvTextLogs: string;
  windowWidth: number;
  csvTextStats: string;
  REPLACE_MOBILE = {
    'Fantasy Points Per Game': 'FPTS/G',
    'Fantasy Points': 'FPTS',
    'FanDuel': 'FD',
    'DraftKings': 'DK',
    'Yahoo': 'YA',
  };
  articles: Array<WpSmBlogItemModel> = [];

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.windowWidth = event.target.innerWidth;
    if (this.windowWidth <= 575) {
      this.csvShowed = false;
    }
    if (this.playerData) {
      if (this.windowWidth <= 1030) {
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
    private singlePlayerService: SinglePlayerService,
    private commonService: CommonService,
    private title: TitleService,
    private dropdownService: DropdownService,
    private videoDataService: VideoDataService,
    private schemaService: SchemaService,
    private showPercentagePipe: ShowPercentagePipe,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.params = {
        id: params.id,
        name: params.name
      };
      this.playerData = this.route.snapshot.data['playerData'].playerData;

      if (this.playerData.team_lineups_route) {
        this.videoDataService.onAddScript(this.playerData.team_lineups_route);
      }

      this.ddData = this.singlePlayerService.getDddObj(this.playerData.seasons_dropdown);
      this.setArticles();
      this.playerData.game_logs_basic_header_order.splice(0, 3); // remove common header
      this.playerData.age = moment(this.playerData.birth_date).diff(moment(), 'years') * -1;
      this.originTableHeaders = {
        basic_header_order: [...this.playerData.basic_header_order],
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

        'description': `${this.playerData.full_name} basketball player page. ${this.playerData.full_name} player stats, game logs, news.`,

        'url': 'https://www.lineups.com' +
        `/nba/player-stats/${this.params.name}${this.params.id ? '/' + this.params.id : ''}`,

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
        `${this.playerData.full_name} basketball player page. ${this.playerData.full_name} player stats, game logs, news.`,
        `${this.playerData.full_name}, ${this.playerData.full_name} Stats, ${this.playerData.full_name} news`,
        'https://www.lineups.com' +
        `/nba/player-stats/${this.params.name}${this.params.id ? '/' + this.params.id : ''}`,
        `Dataset`
      )];

      if (this.playerData.college) {
        schemaObj[0]['alumniOf'] = {
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
          label: 'NBA',
          url: `/nba`
        },
        {
          label: 'Players',
          url: '/nba/players'
        },
        {
          label: 'NBA Player Stats',
          url: `/nba/player-stats`
        },
        {
          label: this.playerData.heading || this.playerData.full_name,
          url: `/nba/player-stats/${this.params.name}${this.params.id ? '/' + this.params.id : ''}`
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
    });
  }

  onDropdownChange() {
    this.ddData.activeSeason = this.commonService.getActiveCheckBoxItems(this.ddData.seasons, 'name')[0];
    this.ddData.activeSeasonGame = this.commonService.getActiveCheckBoxItems(this.ddData.seasonsGame, 'name')[0];
    this.ddData.activeMain = this.commonService.getActiveCheckBoxItems(this.ddData.main, 'prop')[0];
    if (this.ddData.activeMain === this.singlePlayerService.ddsObj.main[1].prop) {
      this.dropdownService.selectActiveItems(this.ddData.secondary, [this.singlePlayerService.ddsObj.secondary[0].prop], 'prop');
      this.ddData.secondary.forEach(item => {
        if (item.prop !== this.singlePlayerService.ddsObj.secondary[0].prop) {
          item.hidden = true;
        }
      });
    } else {
      this.ddData.secondary.forEach(item => {
        item.hidden = false;
      });
    }
    this.ddData.activeMainGame = this.commonService.getActiveCheckBoxItems(this.ddData.mainGame, 'prop')[0];
    this.ddData.activeSecondary =  this.commonService.getActiveCheckBoxItems(this.ddData.secondary, 'prop')[0];
    this.ddData.activeTab =  this.commonService.getActiveCheckBoxItems(this.ddData.tabs, 'prop')[0];

    this.playerData.basic_header_order = [...this.originTableHeaders.basic_header_order];
    if (this.ddData.activeMain === 'basic' && this.ddData.activeSecondary !== 'totals') {
      this.playerData.basic_header_order.splice(1, 1); // removed GS from Per Game, Per 100 Pos, Per 36 mins
    }
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

  private updateCSVText() {
    this.csvTextStats = this.commonService.generateCSV(this.csvFormatStats(this.playerData));
    this.csvTextLogs = this.commonService.generateCSV(this.csvFormatLogs(this.playerData));
  }

  private csvFormatStats(data: any) {
    const resObj = {};
    const ifFantasyHeaders = this.ddData.activeMain === 'fantasy' ? this.originTableHeaders : data ;
    for (const header of data[this.ddData.activeMain + '_header_order']) {
      resObj[ifFantasyHeaders[this.ddData.activeMain + '_header_map'][header]] =
        this.showPercentagePipe.transform(
          data.player_stats[this.ddData.activeSeason][this.ddData.activeMain][this.ddData.activeSecondary][header],
          header
        );
    }
    return [resObj];
  }

  private csvFormatLogs(data: any) {
    return data.game_logs[this.ddData.activeSeasonGame].map((obj) => {
      const resObj = {};
      resObj['Date'] = moment(obj.date).format('M/D/YY');
      resObj['Opp'] = obj.opponent;
      resObj['Score'] = obj.game_score;
      const ifFantasyHeaders = this.ddData.activeMainGame === 'fantasy' ? this.originTableHeaders : data ;
      for (const header of data['game_logs_' + this.ddData.activeMainGame + '_header_order']) {
        resObj[ifFantasyHeaders['game_logs_' + this.ddData.activeMainGame + '_header_map'][header]] =
          this.showPercentagePipe.transform(obj[this.ddData.activeMainGame][header], header);
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

  private setArticles() {
    const articles = this.route.snapshot.data['playerData'].articles;
    if (articles) {
      this.articles = articles;
      if (this.articles.length === 0) {
        this.removeArticlesTab();
      }
    } else {
      this.removeArticlesTab();
    }
  }

  private removeArticlesTab() {
    if (this.ddData.tabs && this.ddData.tabs[2] && this.ddData.tabs[2].prop === 'articles') {
      this.ddData.tabs.splice(2, 1);
    }
  }
}
