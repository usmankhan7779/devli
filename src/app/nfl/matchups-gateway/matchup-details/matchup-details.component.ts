import { Component, Input, OnInit } from '@angular/core';
import { MatchupsService } from '../matchups.service';
import { ActivatedRoute } from '@angular/router';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import * as _ from 'lodash';
import { NflService } from '../../nfl.service';
import * as moment from 'moment';
import { WPService } from '../../../shared/components/wordpress/WP.service';
import { WpSmBlogItemModel } from '../../../shared/components/wordpress/models/wp-sm-blog-item.model';

@Component({
  selector: 'app-matchup-details',
  templateUrl: './matchup-details.component.html',
  styleUrls: [
    './matchup-details.component.scss'
  ]
})
export class MatchupDetailsComponent implements OnInit {
  @Input() set matchupGameKey(id: string) {
    this.matchupsService.getMatchupByGameKey(id)
      .subscribe((res) => {
        this.data = res;
        this.assignLinks();
      });
  }
  @Input() noFollow = false;
  isIndMatchupPage: boolean;
  ddData: any;
  article: WpSmBlogItemModel;
  homeRedirectUrl: string;
  awayRedirectUrl: string;

  actions: any = {};
  radio = {
    header: 'game',
    ats: 'season',
    ou: 'season',
    scoring: {
      offense: {
        home: 'season',
        away: 'season'
      },
      defense: {
        home: 'season',
        away: 'season'
      }
    }
  };
  data: any;
  constructor(
    private route: ActivatedRoute,
    private matchupsService: MatchupsService,
    private dropdownService: DropdownService,
    private nflService: NflService,
    private wpService: WPService,
    private spinnerService: SpinnerService
  ) {
  }

  ngOnInit() {
    this.actions['game'] = true;
    this.route.params.subscribe(() => {
      this.noFollow = this.route.snapshot.data['noFollow'];
    });
    this.route.parent.data.subscribe(data => {
      if (data && data.matchup) {
        this.data = data.matchup[0];
        this.getMatchupArticle();
        this.isIndMatchupPage = true;
        this.ddData = {
          seasonDd: this.dropdownService.prepareGamesDD(this.data.games_dropdown, 'game_key'),
          activeGameId: this.data.nav.game_key,
          activeSeason: this.dropdownService.getActiveSeason(this.data.games_dropdown, this.data.nav.game_key, 'game_key')
        };
        this.ddData.activeGamesDD = _.values(this.ddData.seasonDd[this.ddData.activeSeason].games);
        this.assignLinks()
      }
    });
  }

  onYearDdChange(season) {
    if (this.ddData.activeSeason !== season.season) {
      this.ddData.activeSeason = season.season;
      this.ddData.activeGamesDD = _.values(this.ddData.seasonDd[this.ddData.activeSeason].games);
      this.onTeamDdChange({game_key: season.games[0].game_key});
    }
  }

  onTeamDdChange(team) {
    this.article = null;
    if (this.ddData.activeGameId !== team.game_key) {
      this.ddData.activeGameId = team.game_key;
      this.spinnerService.handleAPICall(this.matchupsService.getMatchupByGameKey(this.ddData.activeGameId))
        .subscribe((res) => {
          this.data = res;
          this.matchupsService.changeIndMatchupData(res);
          this.getMatchupArticle();
        });
    }
  }

  handleYear(year) {
    return this.nflService.handleYear(year);
  }

  private assignLinks() {
    this.homeRedirectUrl = this.data.gateway.home.depth_chart_route || this.data.header.home.depth_chart_route ||
      (this.data.nav && this.data.nav.home_team_depth_chart_route);
    this.awayRedirectUrl = this.data.gateway.away.depth_chart_route || this.data.header.away.depth_chart_route ||
      (this.data.nav && this.data.nav.away_team_depth_chart_route);
  }

  private getMatchupArticle() {
    this.wpService.getMatchupArticle(
      'nfl',
      this.data.nav.home_name,
      this.data.nav.away_name,
      moment(this.data.nav.matchup_time.slice(0, 10), 'YYYY-MM-DD').format('MM/DD/YY')
    ).subscribe(res => {
      this.article = res;
    })
  }
}
