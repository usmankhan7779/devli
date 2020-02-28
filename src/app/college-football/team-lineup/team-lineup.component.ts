import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeamLineupService } from './team-lineup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CollegeFootballService } from '../college-football.service';

@Component({
  selector: 'app-team-lineup',
  templateUrl: './team-lineup.component.html',
  styleUrls: ['../../nba/team-lineup/team-lineup.component.scss', './team-lineup.component.scss']
})
export class TeamLineupComponent implements OnInit, OnDestroy {
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
    private collegeFootballService: CollegeFootballService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamNameParam = params['team_name'];
      this.handleResponse(this.route.snapshot.data['data'])
    });
    this.lineupHeadingSubscription = this.teamLineupService.teamLineupYearWasChanged
      .subscribe(({data, year}) => {
        this.handleResponse(data, year);
      });
  }

  private handleResponse(data, year?) {
    this.activeYear = year || this.collegeFootballService.getPreSelectedSeason() || data.nav.matchup_season;
    this.teamLineup = data;
    this.isDefaultSeason = (this.teamLineup.seasons_dropdown ?
      this.collegeFootballService.checkIfDefaultSeason(this.activeYear, this.teamLineup.seasons_dropdown) :
      this.collegeFootballService.checkIfDefaultSeason(this.activeYear, [], true));
    this.pageHeader = this.route.snapshot.data['header'];
    this.currentTeamIsHome = this.teamLineup.nav.is_home;
    this.pageTitle = this.teamLineup.heading;
  }

  ngOnDestroy() {
    if (this.lineupHeadingSubscription) {
      this.lineupHeadingSubscription.unsubscribe();
    }
  }

  isWinner(teamScore, oppScore) {
    return parseInt(teamScore, 10) > parseInt(oppScore, 10);
  }

  // router link active fix;
  isLinkActive(url: string): boolean {
    return (
      ('/' + this.route.snapshot.url.join('/')) === url ||
      ('/college-football/' + this.route.snapshot.url.join('/')) === url
    );
  }

  performActionOnBreadcrumbClick(breadcrumb) {
    if (breadcrumb.key && breadcrumb.key === '/college-football/year' && breadcrumb.year) {
      this.collegeFootballService.setPreSelectedSeason(breadcrumb.year);
    }
  }
}
