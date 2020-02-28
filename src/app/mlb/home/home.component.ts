import { Component, OnInit } from '@angular/core';
import { MlbService } from '../mlb.service';
import { CommonService } from '../../shared/services/common.service';
import { TitleService } from '../../shared/services/title.service';
import { RosterService } from '../roster/roster.service';
import { ScheduleService } from '../schedule/schedule.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { TeamLineupService } from '../team-lineup/team-lineup.service';
import { WPService } from '../../shared/components/wordpress/WP.service';
import { WpSmBlogItemModel } from '../../shared/components/wordpress/models/wp-sm-blog-item.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ddData: any;
  homeData: any;
  articles: Array<WpSmBlogItemModel> = [];
  isDefaultYear: boolean;
  constructor(
    private mlbService: MlbService,
    private commonService: CommonService,
    private titleService: TitleService,
    private rosterService: RosterService,
    private spinnerService: SpinnerService,
    private teamLineupService: TeamLineupService,
    private scheduleService: ScheduleService,
    private wpService: WPService
  ) { }

  ngOnInit() {
    const preselectedYear = this.mlbService.getPreSelectedGatewaySeason();
    this.mlbService.removePreSelectedGatewaySeason();
    this.getMLBGatewayData(preselectedYear);
    this.wpService.searchPosts('', 4, 'articles', [this.wpService.getLeagueArticlesCategory('mlb')])
      .subscribe(res => {
        this.articles = res;
      });
  }

  onYearDdChange(season) {
    if (this.homeData.year === season.year) {
      return;
    }
    this.getMLBGatewayData(season.year);
  }

  setRosterTeamSeason() {
    this.rosterService.setPreSelectedTeamSeason(this.homeData.year);
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
      default: {
        this.teamLineupService.setPreSelectedTeamSeason(this.homeData.year);
        break;
      }
    }
  }

  private getMLBGatewayData(year?) {
    let apiCall = this.mlbService.getMLBGatewayData(year);
    if (this.homeData) {
      apiCall = this.spinnerService.handleAPICall(apiCall);
    }
    apiCall
      .subscribe(res => {
        const homeData = res;
        if (homeData.matchup_routes) {
          homeData.matchups = this.commonService.createArrayFromNamedObj(homeData.matchup_routes);
        }
        // tslint:disable-next-line:max-line-length
        homeData.lineup_routes = this.commonService.createArrayFromNamedObj(homeData.lineup_routes, 'name', 'url', [
          {obj: homeData.white_logos, prop: 'white_logo'},
          {obj: homeData.primary_hex, prop: 'primary_hex'},
          {obj: homeData.schedule_routes, prop: 'schedule_route'},
          {obj: homeData.roster_routes, prop: 'roster_route'},
          {obj: homeData.news_routes, prop: 'news_route'},
          {obj: homeData.injury_routes, prop: 'injuries_route'},
        ]);
        this.homeData = homeData;
        const defaultYear = parseInt(this.mlbService.getDefaultSeason(this.homeData.seasons_dropdown), 10);
        if (year) {
          this.homeData.year = year;
        } else {
          this.homeData.year = defaultYear;
        }
        this.isDefaultYear = defaultYear === parseInt(this.homeData.year, 10);
        this.titleService.setTitle(homeData.page_title);
      });
  }
}
