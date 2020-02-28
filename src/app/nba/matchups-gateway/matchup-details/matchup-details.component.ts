import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbaMatchupsService } from '../matchups.service';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import * as _ from 'lodash';
import { NbaService } from '../../nba.service';
import { WPService } from '../../../shared/components/wordpress/WP.service';
import { WpSmBlogItemModel } from '../../../shared/components/wordpress/models/wp-sm-blog-item.model';
import * as moment from 'moment';
import { ScoreBarHelperService } from '../../../score-bar/score-bar-helper.service';

@Component({
  selector: 'app-matchup-details',
  templateUrl: './matchup-details.component.html',
  styleUrls: ['./matchup-details.component.scss']
})
export class MatchupDetailsComponent implements OnInit, OnDestroy {
  noSeasonDataYet = false;
  realTimeSubscription: Subscription;
  isIndMatchupPage: boolean;
  ddData: any;
  article: WpSmBlogItemModel;
  @Input() set matchupId(id: string) {
    this.matchupsService.getMatchupById(id)
      .subscribe((res) => {
        this.data = res;
      });
  }
  @Input() noFollow = false;
  data;
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

  constructor(
    private matchupsService: NbaMatchupsService,
    private nbaService: NbaService,
    private scoreBarService: ScoreBarHelperService,
    private route: ActivatedRoute,
    private dropdownService: DropdownService,
    private wpService: WPService,
    private spinnerService: SpinnerService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.noFollow = this.route.snapshot.data['noFollow'];
    });
    this.route.parent.data.subscribe(data => {
      if (data && data.matchup) {
        this.data = data.matchup;
        this.checkSeasonData(data.matchup);
        this.getMatchupArticle();
        this.isIndMatchupPage = true;
        this.ddData = {
          seasonDd: this.dropdownService.prepareGamesDD(this.data.games_dropdown),
          activeGameId: this.data.nav.game_id,
          activeSeason: this.dropdownService.getActiveSeason(this.data.games_dropdown, this.data.nav.game_id)
        };
        this.ddData.activeGamesDD = _.values(this.ddData.seasonDd[this.ddData.activeSeason].games);
        this.subscribeOnRealTimeUpdate();
      }
    });
  }

  ngOnDestroy() {
    if (this.realTimeSubscription) {
      this.realTimeSubscription.unsubscribe();
    }
  }

  onYearDdChange(season) {
    if (this.ddData.activeSeason !== season.season) {
      this.ddData.activeSeason = season.season;
      this.ddData.activeGamesDD = _.values(this.ddData.seasonDd[this.ddData.activeSeason].games);
      this.onTeamDdChange({game_id: season.games[0].game_id});
    }
  }

  handleYear(year) {
    return this.nbaService.handleYear(year);
  }

  onTeamDdChange(team) {
    this.article = null;
    if (this.ddData.activeGameId !== team.game_id) {
      this.ddData.activeGameId = team.game_id;
      this.spinnerService.handleAPICall(this.matchupsService.getMatchupById(this.ddData.activeGameId))
        .subscribe((res) => {
          this.data = res;
          this.checkSeasonData(res);
          this.matchupsService.changeIndMatchupData(res);
          this.getMatchupArticle();
        });
    }
  }

  private checkSeasonData(data) {
    try {
      this.noSeasonDataYet = data.nav.matchup_season === 2020;
    } catch (e) {
      this.noSeasonDataYet = false;
    }
  }

  private subscribeOnRealTimeUpdate() {
    if (this.realTimeSubscription) {
      return;
    }
    this.realTimeSubscription = this.scoreBarService.nbaScoreArrUpdated
      .subscribe((data) => {
        const matchupStatus = data[this.data.nav.game_id];
        if (matchupStatus) {
          this.data.status = matchupStatus;
        }
      });
  }

  private getMatchupArticle() {
    // this.wpService.getMatchupArticle(
    //   'nba',
    //   this.data.nav.home_name,
    //   this.data.nav.away_name,
    //   moment(this.data.nav.matchup_day, 'YYYY-MM-DD').format('MM/DD/YY')
    // ).subscribe(res => {
    //   this.article = res;
    // });
  }
}
