import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Params } from '@angular/router';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { CommonService } from '../../shared/services/common.service';
import { PlayerPageService } from './player-page.service';
import { ShowPercentagePipe } from '../../shared/pipes/show-percentage.pipe';
import { isPlatformBrowser } from '@angular/common';
import { TitleService } from '../../shared/services/title.service';
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
  originTableHeaders;
  ddData;
  params: {
    id?: string,
    name: string
  };
  windowWidth: number;
  sortBy = 'date';
  sortOrder = 'desc';
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
      if (this.windowWidth <= 1050) {
        this.playerData.header_map = this.handleTableHeaders(true);
      } else {
        this.playerData.header_map = this.handleTableHeaders(false);
      }
    }
  }

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private playerPageService: PlayerPageService,
    private commonService: CommonService,
    private title: TitleService,
    private showPercentagePipe: ShowPercentagePipe,
    private videoDataService: VideoDataService,
    private schemaService: SchemaService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.params = {
        id: params.id,
        name: params.name
      };
      this.playerData = this.route.snapshot.data['playerData'];

      if (this.playerData.team_depth_chart_route) {
        this.videoDataService.onAddScript(this.playerData.team_depth_chart_route);
      }

      this.originTableHeaders = {...this.playerData.header_map};
      this.ddData = this.playerPageService.getDddObj(
        this.playerData.seasons_dropdown, this.playerData.player_type, this.playerData.type_dropdown
      );
      this.playerData.age = moment(this.playerData.birth_date).diff(moment(), 'years') * -1;
      if (this.playerData.page_title) {
        this.title.setTitle(this.playerData.page_title);
      } else {
        this.title.setTitle(`${this.playerData.full_name} Player Stats, Player News`);
      }

      const schemaObj = [{
        '@context': 'http://schema.org',

        '@type': 'Person',

        'name': this.playerData.name,

        'description': `${this.playerData.name} football player page. ${this.playerData.name} player stats, game logs, news.`,

        'url': 'https://www.lineups.com' +
        `/nfl/player-stats/${this.params.name}${this.params.id ? '/' + this.params.id : ''}`,

        'birthDate': this.playerData.birth_date,

        'jobTitle': this.playerData.position,

        'memberOf': [
          {
            '@type': 'SportsTeam',
            'name': this.playerData.full_team_name
          }
        ]
      },
        this.commonService.generateDatasetSchema(
          this.playerData.name,
          `${this.playerData.name} football player page. ${this.playerData.name} player stats, game logs, news.`,
          `${this.playerData.name}, ${this.playerData.name} Stats, ${this.playerData.name} news`,
          'https://www.lineups.com' +
          `/nfl/player-stats/${this.params.name}${this.params.id ? '/' + this.params.id : ''}`,
          `Dataset`
          )
      ];

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
          label: 'NFL',
          url: '/nfl'
        },
        {
          label: 'Players',
          url: '/nfl/players'
        },
        {
          label: 'NFL Player Stats',
          url: '/nfl/player-stats'
        },
        {
          label: this.playerData.heading || this.playerData.name,
          url: `/nfl/player-stats/${this.params.name}${this.params.id ? '/' + this.params.id : ''}`
        }
      ]);
      if (this.ddData) {
        this.updateCSVText();
      }
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
    this.ddData.activeMain = this.commonService.getActiveCheckBoxItems(this.ddData.main, 'prop')[0];
    this.ddData.activeMainGame = this.commonService.getActiveCheckBoxItems(this.ddData.mainGame, 'prop')[0];
    this.ddData.activeSeason =  this.commonService.getActiveCheckBoxItems(this.ddData.seasons, 'name')[0];
    this.ddData.activeSeasonGame =  this.commonService.getActiveCheckBoxItems(this.ddData.seasonsGame, 'name')[0];
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

  private updateCSVText() {
    this.csvTextStats = this.commonService.generateCSV(this.csvFormatStats(this.playerData));
    this.csvTextLogs = this.commonService.generateCSV(this.csvFormatLogs(this.playerData));
  }

  private csvFormatStats(data: any) {
    const resObj = {};
    for (const header of data[
      (this.ddData.activeMain === 'fantasy' ? this.ddData.activeMain + '_order_stats' : this.ddData.activeMain + '_order')
      ]) {
      resObj[this.originTableHeaders[header]] =
        this.showPercentagePipe.transform(
          data['player_stats'][this.ddData.activeSeason][this.ddData.activeMain][header],
          header);
    }
    return [resObj];
  }

  private csvFormatLogs(data: any) {
    return data['game_logs'][this.ddData.activeSeasonGame].map((obj) => {
      const resObj = {};
      resObj['Date'] = moment(obj.date).format('M/D/YY');
      resObj['Opp'] = obj.opponent;
      resObj['Score'] = obj.game_score;
      for (const header of data[
        (this.ddData.activeMainGame === 'fantasy' ? this.ddData.activeMainGame + '_order_logs' : this.ddData.activeMainGame + '_order')
        ]) {
        resObj[this.originTableHeaders[header]] =
          this.showPercentagePipe.transform(obj[this.ddData.activeMainGame][header], header);
      }
      return resObj;
    });
  }

  private handleTableHeaders(isMobile) {
    if (isMobile) {
      const headerMap = {
        ...this.originTableHeaders
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
    return this.originTableHeaders;
  }

}
