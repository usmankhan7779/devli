import { Component, OnInit } from '@angular/core';
import { NbaService } from '../nba.service';
import { CommonService } from '../../shared/services/common.service';
import { TitleService } from '../../shared/services/title.service';
import { RosterService } from '../roster/roster.service';
import { ScheduleService } from '../schedule/schedule.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { TeamLineupService } from '../team-lineup/team-lineup.service';
import { DepthChartService } from '../depth-charts/depth-chart.service';
import { WpSmBlogItemModel } from '../../shared/components/wordpress/models/wp-sm-blog-item.model';
import { WPService } from '../../shared/components/wordpress/WP.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isDefaultYear: boolean;
  forceOffseason: boolean;
  homeData;
  articles: Array<WpSmBlogItemModel> = [];
  bettingArticles: Array<WpSmBlogItemModel> = [];
  podcasts: Array<WpSmBlogItemModel> = [];
  constructor(
    private nbaService: NbaService,
    private commonService: CommonService,
    private titleService: TitleService,
    private rosterService: RosterService,
    private spinnerService: SpinnerService,
    private teamLineupService: TeamLineupService,
    private depthChartService: DepthChartService,
    private scheduleService: ScheduleService,
    private wpService: WPService
  ) { }

  ngOnInit() {
    const preselectedYear = this.nbaService.getPreSelectedGatewaySeason();
    this.nbaService.removePreSelectedGatewaySeason();
    this.getNBAGatewayData(preselectedYear);
    this.forceOffseason = this.nbaService.forceOffseason;
    this.wpService.searchPosts('', 4, 'articles', [8])
      .subscribe(res => {
        this.articles = res;
      });
    // this.wpService.searchPosts('', 4, 'betting', [4])
    //   .subscribe(res => {
    //     this.bettingArticles = res;
    //   });
    // this.wpService.searchPosts('', 4, 'podcasts', [54])
    //   .subscribe(res => {
    //     this.podcasts = res;
    //   });
  }

  onYearDdChange(season) {
    if (this.homeData.year === season.year) {
      return;
    }
    this.getNBAGatewayData(season.year);
  }

  displayCurrentYearDD(year) {
    return this.nbaService.handleYear(year);
  }

  private getNBAGatewayData(year?) {
    let apiCall = this.nbaService.getNBAGatewayData(year);
    if (this.homeData) {
      apiCall = this.spinnerService.handleAPICall(apiCall);
    }
    apiCall
      .subscribe(res => {
        const homeData = {...res};
        if (homeData.matchups) {
          homeData.matchup_routes = this.commonService.createArrayFromNamedObj(homeData.matchups);
        }
        // tslint:disable-next-line:max-line-length
        homeData.lineup_routes = this.commonService.createArrayFromNamedObj(homeData.lineup_routes, 'name', 'url', [
          {obj: homeData.white_logos, prop: 'white_logo'},
          {obj: homeData.primary_hex, prop: 'primary_hex'},
          {obj: homeData.schedule_routes, prop: 'schedule_route'},
          {obj: homeData.roster_routes, prop: 'roster_route'},
          {obj: homeData.news_routes, prop: 'news_route'},
          {obj: homeData.injury_routes, prop: 'injuries_route'},
          {obj: homeData.depth_chart_routes, prop: 'depth_chart_route'},
        ]);
        this.homeData = homeData;
        this.titleService.setTitle(homeData.page_title);
        const defaultYear = parseInt(this.nbaService.getDefaultSeason(this.homeData.seasons_dropdown), 10);
        this.isDefaultYear = defaultYear === parseInt(this.homeData.year, 10);
      });
  }

  setRosterTeamSeason() {
    this.rosterService.setPreSelectedTeamSeason(this.homeData.year);
  }

  setDepthChartTeamSeason() {
    this.depthChartService.setPreSelectedTeamSeason(this.homeData.year);
  }

  setScheduleTeamSeason() {
    this.scheduleService.setPreSelectedTeamSeason(this.homeData.year);
  }

  setLineupTeamSeason(type) {
    switch (type) {
      case 'schedule_route': {
        this.setScheduleTeamSeason();
        break;
      }
      case 'roster_route': {
        this.setRosterTeamSeason();
        break;
      }
      case 'depth_chart_route': {
        this.setDepthChartTeamSeason();
        break;
      }
      default: {
        this.teamLineupService.setPreSelectedTeamSeason(this.homeData.year);
        break;
      }
    }
  }
}
