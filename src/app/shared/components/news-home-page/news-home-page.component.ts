
import {forkJoin as observableForkJoin,  Observable ,  Subject } from 'rxjs';

import {debounceTime} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbaService } from '../../../nba/nba.service';
import { MlbService } from '../../../mlb/mlb.service';
import { NflService } from '../../../nfl/nfl.service';
import * as NbaNewsService from '../../../nba/news/news.service';
import * as NflNewsService from '../../../nfl/news/news.service';
import * as MlbNewsService from '../../../mlb/news/news.service';
import { NewsHomePageService } from './news-home-page.service';
import { SpinnerService } from '../spinner/spinner.service';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';
import { TitleService } from '../../services/title.service';


@Component({
  selector: 'app-news-home-page',
  templateUrl: './news-home-page.component.html',
  styleUrls: ['./news-home-page.component.scss']
})
export class NewsHomePageComponent implements OnInit, OnDestroy {
  currentLeague: string;
  introParagraph: string;
  pageTitle: string;
  currentLeagueService: NbaService | MlbService | NflService;
  currentLeagueNewsService: NbaNewsService.NewsService | NflNewsService.NewsService | MlbNewsService.NewsService;
  currentPage = 1;
  teamData;
  originTeamData;
  ddData: any = {
    teamActive: {
      name: 'All Teams',
      id: 'all',
      selected: true
    },
    perPageActive: '50',
    perPage: [
      {
        name: '50',
        id: '50',
        selected: true
      },
      {
        name: '100',
        id: '100',
        selected: false
      },
      {
        name: '200',
        id: '200',
        selected: false
      },
      {
        name: '500',
        id: '500',
        selected: false
      }
    ]
  };
  searchModel: string;
  searchTerm$ = new Subject<string>();

  constructor(
    private commonNewsService: NewsHomePageService,
    private breadcrumbService: BreadcrumbService,
    private nbaNewsService: NbaNewsService.NewsService,
    private nflNewsService: NflNewsService.NewsService,
    private mlbNewsService: MlbNewsService.NewsService,
    private nbaService: NbaService,
    private mlbService: MlbService,
    private nflService: NflService,
    private spinnerService: SpinnerService,
    private commonService: CommonService,
    private title: TitleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let gatewayApiCall: Observable<any>;
    this.currentLeague = this.route.snapshot.data['url'].toLowerCase();
    switch (this.currentLeague) {
      case 'mlb': {
        this.currentLeagueNewsService = this.mlbNewsService;
        this.currentLeagueService = this.mlbService;
        gatewayApiCall = this.currentLeagueService.getMLBGatewayData();
        break;
      }
      case 'nfl': {
        this.currentLeagueNewsService = this.nflNewsService;
        this.currentLeagueService = this.nflService;
        gatewayApiCall = this.currentLeagueService.getNFLGatewayData();
        break;
      }
      case 'nba': {
        this.currentLeagueNewsService = this.nbaNewsService;
        this.currentLeagueService = this.nbaService;
        gatewayApiCall = this.currentLeagueService.getNBAGatewayData();
        break;
      }
    }
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
        url: `/${this.currentLeague}/news`,
        label: 'News'
      }
    ];
    this.breadcrumbService.changeBreadcrumbs(breadcrumbs);
    observableForkJoin([gatewayApiCall,
      this.commonNewsService.getAllTeamNews(this.currentLeague, this.currentPage, this.ddData.perPageActive)])
      .subscribe(([gatewayRes, allTeamNewsRes]) => {
        this.introParagraph = allTeamNewsRes.intro_paragraph;
        this.pageTitle = allTeamNewsRes.heading;
        if (allTeamNewsRes.page_title) {
          this.title.setTitle(allTeamNewsRes.page_title);
        }
        this.ddData.teams = this.generateTeamDd(this.commonService.createArrayFromNamedObj(gatewayRes.news_routes || gatewayRes.news));
        this.hanldeAllTeamNewsRes(allTeamNewsRes);
      });
    this.initFilter();
  }

  ngOnDestroy() {
    this.searchTerm$.unsubscribe();
  }

  filterByName(filterVal) {
    this.searchModel = filterVal;
    this.searchTerm$.next();
  }

  private initFilter() {
    this.searchTerm$.pipe(
      debounceTime(500))
      .subscribe(() => {
        if (this.ddData.teamActive.id === 'all') {
          this.commonNewsService.getAllTeamNews(this.currentLeague, this.currentPage,  this.ddData.perPageActive, this.searchModel)
            .subscribe(this.hanldeAllTeamNewsRes.bind(this));
        } else {
          let dataToFilter = this.originTeamData.news.slice(0);
          dataToFilter = dataToFilter.filter((item) => {
            return item.title.toLowerCase().indexOf(this.searchModel.toLowerCase()) !== -1;
          });
          this.teamData.news = this.cutTeamDataArray({news: dataToFilter}, this.ddData.perPageActive);
        }
      });
  }


  onDdSelectSelect() {
    this.searchModel = '';
    this.ddData.perPageActive = this.commonService.getActiveCheckBoxItems(this.ddData.perPage, 'id')[0];
    const prevActiveTeam = this.ddData.teamActive;
    this.ddData.teamActive = this.commonService.getActiveCheckBoxItems(this.ddData.teams, '', true)[0];
    if (this.ddData.teamActive.id !== 'all') {
      if (prevActiveTeam.id === this.ddData.teamActive.id) {
        return this.teamData.news = this.cutTeamDataArray(this.originTeamData, this.ddData.perPageActive);
      }
      return this.spinnerService.handleAPICall(this.currentLeagueNewsService.getTeamNews(this.ddData.teamActive.id))
        .subscribe((res) => {
          this.originTeamData = res;
          this.teamData = {
            ...this.originTeamData,
            news: this.cutTeamDataArray(this.originTeamData, this.ddData.perPageActive)
          };
        });
    } else {
      return this.spinnerService.handleAPICall(
        this.commonNewsService.getAllTeamNews(this.currentLeague, this.currentPage,  this.ddData.perPageActive)
      ).subscribe(this.hanldeAllTeamNewsRes.bind(this));
    }
  }

  private generateTeamDd(teamArr) {
    const res = [];
    res.push(this.ddData.teamActive);
    teamArr.forEach((item, i) => {
      res.push({
        name: item.name,
        id: item.url.split('/').pop(),
        selected: false
      });
    });
    res.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    return res;
  }

  private cutTeamDataArray(teamDataOriginalArray, perPage) {
    return teamDataOriginalArray.news.slice(0, Number(perPage))
  }

  private hanldeAllTeamNewsRes(allTeamNewsRes) {
    this.teamData = {
      news: allTeamNewsRes.results,
      nav: {
        team_name_full: 'All Teams'
      }
    };
  }

}
