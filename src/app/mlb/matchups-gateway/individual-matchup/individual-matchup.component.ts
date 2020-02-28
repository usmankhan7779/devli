import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScheduleService } from '../../schedule/schedule.service';
import { isPlatformBrowser } from '@angular/common';
import { TitleService } from '../../../shared/services/title.service';
import { Subscription } from 'rxjs';
import { MatchupsGatewayService } from '../matchups-gateway.service';
import * as moment from 'moment';
import { TeamLineupService } from '../../team-lineup/team-lineup.service';
import { CommonService } from '../../../shared/services/common.service';
import * as _ from 'lodash';
import { ScoreBarHelperService } from '../../../score-bar/score-bar-helper.service';
@Component({
  selector: 'app-individual-matchup',
  templateUrl: './individual-matchup.component.html',
  styleUrls: ['./individual-matchup.component.scss']
})
export class IndividualMatchupComponent implements OnInit, OnDestroy {
  realTimeSubscription: Subscription;
  indMatchupDataWasChangedSubscription: Subscription;
  isCollapsed: boolean;
  isBrowser: boolean;
  showTabs: any;
  preSelectedDate: string;
  matchup: any;
  additionalInfo: any;
  params: {team_names: string, year?};
  ddData: any;
  constructor(
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private router: Router,
    private title: TitleService,
    private scheduleService: ScheduleService,
    private matchupsService: MatchupsGatewayService,
    private scoreBarService: ScoreBarHelperService,
    private commonService: CommonService,
    private teamLineupService: TeamLineupService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.route.params.subscribe((params: Params) => {
      this.showTabs = {
        schedule: false,
        injuries: false,
        matchupNews: false
      };
      this.params = {
        team_names: params.team_names
      };
      this.handleApiResponse(this.route.snapshot.data['matchup']);
      this.subscribeOnRealTimeUpdate();
    });

    this.indMatchupDataWasChangedSubscription = this.matchupsService.indMatchupDataWasChanged
      .subscribe(res => {
        this.handleApiResponse(res);
      })
  }

  ngOnDestroy() {
    if (this.indMatchupDataWasChangedSubscription) {
    this.indMatchupDataWasChangedSubscription.unsubscribe();
    }
    if (this.realTimeSubscription) {
      this.realTimeSubscription.unsubscribe();
    }
  }

  allowShortNames() {
    return this.isBrowser && window.innerWidth < 1160;
  }

  onTabClick(tabType, show: boolean) {
    for (const key in this.showTabs) {
      if (this.showTabs.hasOwnProperty(key)) {
        if (key === tabType) {
          this.showTabs[key] = show;
        } else {
          this.showTabs[key] = false;
        }
        this.commonService.scrollTopPage();
      }
    }
  }

  isActive(url): boolean {
    // Set the second parameter to true if you want to require an exact match.
    return this.router.isActive(this.router.createUrlTree([url]), true);
  }

  private handleApiResponse(res) {
    this.matchup = res;
    try {
      this.additionalInfo = {
        dome_text: this.matchup.header.details.dome_text,
        rain: this.matchup.header.details.rain,
        risk: this.matchup.header.details.risk,
        forecast_wind_speed: this.matchup.header.details.wind,
        forecast_wind_direction: this.matchup.header.details.dark_sky_wind_bearing
      };
    } catch (err) {
      console.error('Error in matchup weather obj');
    }

    this.title.setTitle(res.page_title);
    const matchup_time = moment(this.matchup.nav.matchup_time);
    this.params.year = this.matchup.nav.matchup_season;
    const date = matchup_time.format('M/D');
    const shortYearDate = matchup_time.format('M/D/YY');
    this.preSelectedDate = matchup_time.format('MM/DD/YYYY');
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'MLB', url: '/mlb'},
      {label: 'Teams', url: '/mlb/teams'},
      {label: 'MLB Matchups', url: '/mlb/matchups'},
      {
        label: this.params.year,
        url: '/mlb/schedule',
        key: `/mlb/schedule/year/${this.params.year}`
      },
      {
        label: date,
        url: `/mlb/schedule`,
        key: `/mlb/schedule/${matchup_time.format('MM-DD-YYYY')}`
      },
      {
        label: `${this.matchup.nav.away_name_full} at ${this.matchup.nav.home_name_full} Matchup ${shortYearDate}`,
        url: `/mlb/matchups/${this.params.team_names}`
      }
    ]);
  }

  performActionOnBreadcrumbClick(breadcrumb) {
    if (breadcrumb.key && _.includes(breadcrumb.key, '/mlb/schedule/year/')) {
      this.scheduleService.setStartSeasonPreselectedDate(parseInt(breadcrumb.key.replace('/mlb/schedule/year/', ''), 10));
    } else if (breadcrumb.key && _.includes(breadcrumb.key, '/mlb/schedule/')) {
      this.scheduleService.setPreSelectedDate(breadcrumb.key.replace('/mlb/schedule/', ''));
    }
  }

  preselectTeamSeason() {
    if (this.params && this.params.year) {
      this.teamLineupService.setPreSelectedTeamSeason(this.params.year);
    }
  }

  private subscribeOnRealTimeUpdate() {
    if (this.realTimeSubscription) {
      return;
    }
    this.realTimeSubscription = this.scoreBarService.mlbScoreArrUpdated
      .subscribe((data) => {
        const matchupStatus = data[this.matchup.nav.game_id];
        if (matchupStatus && this.matchup && this.matchup.nav) {
          this.matchup.nav.status = matchupStatus;
          this.matchup.nav.updated = matchupStatus.game_updated;
        }
      });
  }
}
