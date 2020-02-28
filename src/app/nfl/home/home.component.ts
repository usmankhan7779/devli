import { Component, OnInit } from '@angular/core';
import { NflService } from '../nfl.service';
import { CommonService } from '../../shared/services/common.service';
import { TitleService } from '../../shared/services/title.service';
import { RosterService } from '../roster/roster.service';
import { ScheduleService } from '../schedule/schedule.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { DepthChartService } from '../depth-charts/depth-chart.service';
import { TeamSnapCountsService } from '../team-snap-counts-page/team-snap-counts.service';
import { IndTeamStatsService } from '../teams/ind-team-stats/ind-team-stats.service';
import { WpSmBlogItemModel } from '../../shared/components/wordpress/models/wp-sm-blog-item.model';
import { WPService } from '../../shared/components/wordpress/WP.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  homeData: any;
  ddData: any;
  isDefaultYear: boolean;
  articles: Array<WpSmBlogItemModel> = [];
  bettingArticles: Array<WpSmBlogItemModel> = [];
  podcasts: Array<WpSmBlogItemModel> = [];
  constructor(
    private nflService: NflService,
    private commonService: CommonService,
    private titleService: TitleService,
    private rosterService: RosterService,
    private spinnerService: SpinnerService,
    private depthChartService: DepthChartService,
    private teamSnapCountsService: TeamSnapCountsService,
    private scheduleService: ScheduleService,
    private indTeamStatsService: IndTeamStatsService,
    private wpService: WPService,
  ) { }

  ngOnInit() {
    const preselectedYear = this.nflService.getPreSelectedGatewaySeason();
    this.nflService.removePreSelectedGatewaySeason();
    this.getNFLGatewayData(preselectedYear);
    this.wpService.searchPosts('', 4, 'articles', [this.wpService.getLeagueArticlesCategory('nfl')])
      .subscribe(res => {
        this.articles = res;
      });
    // 173 - "NFL Betting Picks" category on /betting/

    // this.wpService.searchPosts('', 4, 'betting', [173])
    //   .subscribe(res => {
    //     this.bettingArticles = res;
    //   });

    // 62,64 for "NFL Talking Heads Fantasy Football Podcast" and "Sharp Edges: Sports Betting Podcast" categories on /podcasts/

    // this.wpService.searchPosts('', 4, 'podcasts', [62, 64])
    //   .subscribe(res => {
    //     this.podcasts = res;
    //   });
  }

  onYearDdChange(season) {
    if (this.homeData.year === season.year) {
      return;
    }
    this.getNFLGatewayData(season.year);
  }

  displayCurrentYearDD(year) {
    return this.nflService.handleYear(year);
  }

  getYearForLink() {
    return this.nflService.checkIfDefaultSeason(this.homeData.year, this.homeData.seasons_dropdown) ? '' : this.homeData.year + '/';
  }

  setRosterTeamSeason() {
    this.rosterService.setPreSelectedTeamSeason(this.homeData.year);
  }

  setSnapCountsTeamSeason() {
    this.teamSnapCountsService.setPreSelectedTeamSeason(this.homeData.year);
  }

  setStatsTeamSeason() {
    this.indTeamStatsService.setPreSelectedTeamSeason(this.homeData.year);
  }

  setDepthChartTeamSeason(type) {
    switch (type) {
      case 'schedule_route': {
        this.setScheduleTeamSeason();
        break;
      }
      case 'roster_route': {
        this.setRosterTeamSeason();
        break;
      }
      case 'snap_counts_route': {
        this.setSnapCountsTeamSeason();
        break;
      }
      case 'team_stats_routes': {
        this.setStatsTeamSeason();
        break;
      }
      default: {
        this.depthChartService.setPreSelectedTeamSeason(this.homeData.year);
        break;
      }
    }
  }

  setScheduleTeamSeason() {
    this.scheduleService.setPreSelectedTeamSeason(this.homeData.year);
  }

  private getNFLGatewayData(year?) {
    let apiCall = this.nflService.getNFLGatewayData(year);
    if (this.homeData) {
      apiCall = this.spinnerService.handleAPICall(apiCall);
    }
    apiCall
      .subscribe(res => {
        const homeData = {...res};
        if (homeData.matchups) {
          homeData.matchup_routes = this.commonService.createArrayFromNamedObj(homeData.matchups);
        }
        const statsRoutes: any = {};
        Object.keys(this.nflService.nflTeams).forEach((abbr: string) => {
          const item = this.nflService.nflTeams[abbr];
          statsRoutes[item.team_name] = '/nfl/team-stats/' + item.team_route;
        });
        // tslint:disable-next-line:max-line-length
        homeData.depth_chart_routes = this.commonService.createArrayFromNamedObj(homeData.depth_chart_routes, 'name', 'url', [
          {obj: homeData.white_logos, prop: 'white_logo'},
          {obj: homeData.primary_hex, prop: 'primary_hex'},
          {obj: homeData.schedule_routes, prop: 'schedule_route'},
          {obj: homeData.roster_routes, prop: 'roster_route'},
          {obj: homeData.team_snaps_routes, prop: 'snap_counts_route'},
          {obj: homeData.news_routes, prop: 'news_route'},
          {obj: homeData.injury_routes, prop: 'injuries_route'},
          {obj: statsRoutes, prop: 'stats_route'},
          {obj: homeData.team_stats_routes, prop: 'team_stats_route'},
        ]);
        this.homeData = homeData;
        const defaultYear = parseInt(this.nflService.getDefaultSeason(this.homeData.seasons_dropdown), 10);
        this.isDefaultYear = defaultYear === parseInt(this.homeData.year, 10);
        this.titleService.setTitle(homeData.page_title);
      });
  }

}
