import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamLineupService } from './team-lineup.service';
import { ScheduleService } from '../schedule/schedule.service';
import { NbaService } from '../nba.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { ScoreBarHelperService } from '../../score-bar/score-bar-helper.service';

@Component({
  selector: 'app-team-lineup',
  templateUrl: './team-lineup.component.html',
  styleUrls: ['./team-lineup.component.scss']
})
export class TeamLineupComponent implements OnInit, OnDestroy {
  realTimeSubscription: Subscription;
  lineupHeadingSubscription: Subscription;
  teamNameParam: string;
  teamLineup: any;
  pageTitle: string;
  currentTeamIsHome: boolean;
  isDefaultSeason: boolean;
  activeYear: number;
  pageHeader: string;

  constructor(
    private teamLineupService: TeamLineupService,
    private router: Router,
    private route: ActivatedRoute,
    private nbaService: NbaService,
    private scoreBarService: ScoreBarHelperService,
    private scheduleService: ScheduleService
  ) {}

  // Lifecycle Hooks
  // ---------------
  ngOnInit() {
    // Make Subscription to the Active Route
    this.route.params.subscribe(params => {
      // Set Router Param Dependent Values
      this.teamNameParam = params['team_name'];
      this.handleResponse(this.route.snapshot.data['data'])
    });
    this.lineupHeadingSubscription = this.teamLineupService.teamLineupYearWasChanged
      .subscribe(({data, year, heading}) => {
        this.handleResponse(data, year, heading);
      });
  }

  private handleResponse(data, year?, heading?) {
    if (data) {
      this.activeYear = year || this.teamLineupService.getPreSelectedTeamSeason() || data.nav.matchup_season;
      this.teamLineup = data;
      this.subscribeOnRealTimeUpdate();
      this.isDefaultSeason = (this.teamLineup.seasons_dropdown ?
        this.nbaService.checkIfDefaultSeason(this.activeYear, this.teamLineup.seasons_dropdown) :
        this.nbaService.checkIfDefaultSeason(this.activeYear, [], true));
      this.pageHeader = this.route.snapshot.data['header'];
      this.currentTeamIsHome = this.teamLineup.nav.is_home;
      if (this.pageHeader === 'Depth Chart' && this.teamLineup.page_data && this.teamLineup.page_data.heading) {
        this.pageTitle = this.teamLineup.page_data.heading;
      } else if (this.teamLineup.heading && this.pageHeader !== 'Injuries') {
        this.pageTitle = this.teamLineup.heading;
      } else {
        let showYear = '';
        if (this.route.snapshot.data['showYear'] &&
          this.teamLineup.seasons_dropdown &&
          !this.nbaService.checkIfDefaultSeason(this.activeYear, this.teamLineup.seasons_dropdown)) {
          showYear = ' ' + this.activeYear;
        }
        this.pageTitle = `${this.teamLineup.nav.team_name_full} ${this.pageHeader}${showYear}`;
      }
    } else if (heading) {
      this.pageTitle = heading;
    }
  }

  ngOnDestroy() {
    if (this.lineupHeadingSubscription) {
      this.lineupHeadingSubscription.unsubscribe();
    }
    if (this.realTimeSubscription) {
      this.realTimeSubscription.unsubscribe();
    }
  }

  isWinner(teamScore, oppScore) {
    return parseInt(teamScore, 10) > parseInt(oppScore, 10);
  }

  // router link active fix;
  isLinkActive(url: string): boolean {
    return (
      ('/' + this.route.snapshot.url.join('/')) === url ||
      ('/nba/' + this.route.snapshot.url.join('/')) === url
    );
  }

  showHalftime(status) {
    return this.nbaService.showHalftime(status);
  }

  performActionOnBreadcrumbClick(breadcrumb) {
    if (breadcrumb.key && _.includes(breadcrumb.key, '/nba/schedule/year')) {
      const year = parseInt(<any>this.activeYear || this.nbaService.getDefaultSeason(this.teamLineup.seasons_dropdown), 10);
      this.scheduleService.setStartSeasonPreselectedDate(year);
    }
    if (breadcrumb.key && breadcrumb.key === '/nba/year' && breadcrumb.year) {
      this.nbaService.setPreSelectedGatewaySeason(breadcrumb.year);
    }
  }



  private subscribeOnRealTimeUpdate() {
    if (this.realTimeSubscription) {
      return;
    }
    this.realTimeSubscription = this.scoreBarService.nbaScoreArrUpdated
      .subscribe((data) => {
        const lineupStatus = data[this.teamLineup.nav.game_id];
        if (lineupStatus) {
          this.teamLineup.nav.status = lineupStatus;
        }
      });
  }

}
