import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatchupsGatewayService } from '../matchups-gateway.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { ScoreBarHelperService } from '../../../score-bar/score-bar-helper.service';

@Component({
  selector: 'app-matchup-details',
  templateUrl: './matchup-details.component.html',
  styleUrls: ['./matchup-details.component.scss']
})
export class MatchupDetailsComponent implements OnInit, OnDestroy {
  realTimeSubscription: Subscription;
  isIndMatchupPage: boolean;
  ddData: any;

  @Input() set matchupId(id: string) {
    this.matchupsService.getMatchupById(id)
      .subscribe((res) => {
        this.data = res;
      });
  }

  @Input() noFollow = false;
  radio = {
    stats: 'season',
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
  actions: any = {};
  data;
  constructor(
    private matchupsService: MatchupsGatewayService,
    private scoreBarService: ScoreBarHelperService,
    private dropdownService: DropdownService,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.actions['game'] = true;
    this.route.params.subscribe(() => {
      this.noFollow = this.route.snapshot.data['noFollow'];
    });
    this.route.parent.data.subscribe(data => {
      if (data && data.matchup) {
        this.data = data.matchup;
        this.isIndMatchupPage = true;
        this.ddData = {
          seasonDd: this.dropdownService.prepareGamesDD(this.data.games_dropdown),
          activeGameId: this.data.nav.game_id,
          activeSeason: this.dropdownService.getActiveSeason(this.data.games_dropdown, this.data.nav.game_id)
        };
        this.ddData.activeGamesDD = _.values(this.ddData.seasonDd[this.ddData.activeSeason].games);
        this.subscribeOnRealTimeUpdate();
        this.scoreBarService.fireMlbUpdate();
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

  onTeamDdChange(team) {
    if (this.ddData.activeGameId !== team.game_id) {
      this.ddData.activeGameId = team.game_id;
      this.spinnerService.handleAPICall(this.matchupsService.getMatchupById(this.ddData.activeGameId))
        .subscribe((res) => {
          this.data = res;
          this.matchupsService.changeIndMatchupData(res);
        });
    }
  }

  private subscribeOnRealTimeUpdate() {
    if (this.realTimeSubscription) {
      return;
    }
    this.realTimeSubscription = this.scoreBarService.mlbScoreArrUpdated
      .subscribe((data) => {
        const matchupStatus = data[this.data.nav.game_id];
        if (matchupStatus) {
          this.data.status = matchupStatus;
          this.data.odds_comparison.win_prob.lineups_away = matchupStatus.away_win_probability;
          this.data.odds_comparison.win_prob.lineups_home = matchupStatus.home_win_probability;
          this.data.nav.updated = matchupStatus.game_updated;
        }
      });
  }
}
