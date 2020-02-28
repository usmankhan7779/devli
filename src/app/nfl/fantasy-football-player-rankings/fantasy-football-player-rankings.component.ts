import { Component, Inject, Injector, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { NflService } from '../nfl.service';
import { ActivatedRoute } from '@angular/router';
import { FantasyFootballPlayerRankingsService } from './fantasy-football-player-rankings.service';
import { TitleService } from '../../shared/services/title.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import * as _ from 'lodash';
import { PlayerNewsModalComponent } from '../../shared/modals/player-news-modal/player-news-modal.component';
import { CommonService } from '../../shared/services/common.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';
import { SchemaService } from '../../shared/services/schema.service';

@Component({
  selector: 'app-fantasy-football-player-rankings',
  templateUrl: './fantasy-football-player-rankings.component.html',
  styleUrls: ['./fantasy-football-player-rankings.component.scss']
})
export class FantasyFootballPlayerRankingsComponent implements OnInit, OnDestroy {
  data;
  playersData: any;
  currentPage: number;
  ddData;
  totalItems: number;
  orderByParam: string;
  params: {url: string};
  positionOrOverall: string;
  dropdownCollapsed: boolean;
  tierRowArr: any[];
  private modalService;
  constructor(
    private nflService: NflService,
    private route: ActivatedRoute,
    private fantasyFootballPlayerRankingsService: FantasyFootballPlayerRankingsService,
    private titleService: TitleService,
    private breadcrumbService: BreadcrumbService,
    private schemaService: SchemaService,
    private spinnerService: SpinnerService,
    private commonService: CommonService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService = this.injector.get(NgbModal);
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentPage = 1;
      this.spinnerService.hideSpinner();
      this.params = {
        url: params.type
      };
      this.data = this.route.snapshot.data['pageData'];
      this.totalItems = this.data.count;
      console.log('DATA', this.data);
      const breadcrumbs = [
        {label: 'NFL', url: '/nfl'},
      ];
      if (this.params.url) {
        breadcrumbs.push(
          {label: 'Fantasy Football Rankings', url: '/fantasy-football-rankings'},
          {label: this.data.heading, url: `/fantasy-football-rankings/${this.params.url}`}
        );
        this.positionOrOverall = 'position';
      } else {
        breadcrumbs.push(
          {label: this.data.heading, url: '/fantasy-football-rankings'},
        );
        this.positionOrOverall = 'overall';
      }
      this.breadcrumbService.changeBreadcrumbs(breadcrumbs);
      this.titleService.setTitle(this.data.page_title);
      this.ddData = this.fantasyFootballPlayerRankingsService.getDDdata(this.params.url);
      this.formatPlayersData();
      this.setSchema();
      this.tierRowArr = this.getTierRowArr();
    })
  }

  onPageChange(page?) {
    if (page) {
      this.currentPage = page;
    }
    this.spinnerService.handleAPICall(
      this.fantasyFootballPlayerRankingsService.getFantasyData(
        null,
        this.fantasyFootballPlayerRankingsService.getPositionKey(this.params.url),
        this.currentPage,
        this.ddData.activeItemPerPage.prop
      )
    ).subscribe(res => {
      this.data = res;
      this.formatPlayersData();
      this.setSchema();
    });
  }

  ngOnDestroy() {
    this.spinnerService.hideSpinner();
  }

  onPlayerNewsClick(isActive: boolean, id: number) {
    if (!isActive) {
      return;
    }
    let players = this.data.results.filter(player => player.has_news);
    players = players.map(player => {
      return {
        player_id: player.player_id,
        name: player.full_name || player.name,
        type: player.position,
        team: player.team.toUpperCase()
      };
    });
    const modalRef = this.modalService.open(PlayerNewsModalComponent, {size: 'lg', windowClass: `lineups-custom-modal common-modal` });
    modalRef.componentInstance.data = {
      league: 'nfl',
      players,
      selectedPlayerId: id
    };
  }

  onPageDropdownChange() {
    this.ddData.activeItemPerPage = this.commonService.getActiveCheckBoxItems(this.ddData['items_per_page'], 'name', true)[0];
    this.onPageChange();
  }

  onTabDropdownChange() {
    this.ddData.activeSeasonTab = this.commonService.getActiveCheckBoxItems(this.ddData['seasonTabs'], 'prop')[0];
    this.tierRowArr = this.getTierRowArr();
  }

  onTabClick(tabProp) {
    for (const tab of this.ddData.seasonTabs) {
      tab.selected = false;
      if (tab.prop === tabProp) {
        tab.selected = true;
        this.ddData.activeSeasonTab = tabProp;
      }
    }
    this.tierRowArr = this.getTierRowArr();
  }

  showSpinner(doNotShow = false) {
    if (doNotShow) {
      return;
    }
    this.spinnerService.showSpinner();
  }

  private getTierRowLength() {
    if (this.data.is_off_season && !this.removeOnIDP()) {
     return 11;
    }
    if (!this.params.url) {
      return (this.data.is_off_season ? 8 : (this.ddData.activeSeasonTab !== '' ? 17 : 16));
    }
    return (this.data.is_off_season ? (this.ddData.activeSeasonTab !== '' ? 15 : 13) : (this.ddData.activeSeasonTab !== '' ? 17 : 16));
  }

  private getTierRowArr() {
    const arr = [];
    const length = this.getTierRowLength();
    for (let i = 0; i < length; i++) {
      arr.push(i);
    }
    return arr;
  }

  removeOnIDP() {
    return this.params.url !== 'defensive-player-idp';
  }

  private formatPlayersData() {
    const playersData = _.groupBy(this.data.results, `${this.positionOrOverall}_tier${this.ddData.activeSeasonTab}`);
    this.playersData = Object.keys(playersData).map(key => {
      return {
        tier: key,
        data: playersData[key]
      }
    });
    if (this.data.is_off_season) {
      this.orderByParam = `overall_rank${this.ddData.activeSeasonTab}`;
    } else {
      this.orderByParam = `fantasy_points${this.ddData.activeSeasonTab}_rank${(this.positionOrOverall === 'overall' ? '' : '_position')}`;
    }
  }

  private setSchema() {
    const playersSchema = [];
    if (this.playersData && this.playersData.length) {
      this.playersData.forEach(tier => {
        if (tier.data && tier.data.length) {
          tier.data.forEach(player => {
            if (player.profile_url && player.name && player.team_full_name) {
              playersSchema.push({
                '@context': 'http://schema.org',
                '@type': 'Person',
                'name': player.name,
                'url': `https://www.lineups.com${player.profile_url}`,
                'jobTitle': player.position,
                'memberOf': [
                  {
                    '@type': 'SportsTeam',
                    'name': player.team_full_name,
                    'sport': 'American Football',
                    'memberOf': [{
                      '@type': 'SportsOrganization',
                      'name': 'NFL'
                    }]
                  }
                ]
              });
            }
          });
        }
      });
    }
    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      'Fantasy Football Rankings',
      // tslint:disable-next-line:max-line-length
      'Fantasy football rankings that are updated daily. These rankings are utilized for fantasy drafts and in season team updates. Rankings include player, fantasy points projection, average draft position, auction value, position, team, stats, depth order and bye week. There is an option to select standard, ppr or half ppr leagues as well as seeing all players or sorting by position.',
      'fantasy football rankings, fantasy football player rankings, fantasy football',
      'https://www.lineups.com/fantasy-football-rankings',
      'Dataset'
    ), ...playersSchema]);
  }

}
