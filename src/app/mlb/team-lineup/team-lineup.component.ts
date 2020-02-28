import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

// Services
import { TeamLineupService } from './team-lineup.service';
import { MlbService } from '../mlb.service';
import { TitleService } from '../../shared/services/title.service';
import { CommonService } from '../../shared/services/common.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-team-lineup',
  templateUrl: './team-lineup.component.html',
  styleUrls: ['./team-lineup.component.scss']
})
export class TeamLineupComponent implements OnInit, OnDestroy {
  teamNameParam: string;
  teamLineup: any;
  pageTitle: string;
  currentTeamIsHome: boolean;
  isDefaultSeason: boolean;
  // Page Year Values
  activeYear: number;
  pageName: string;
  subscriptions: Subscription[] = [];

  constructor(
    private teamLineupService: TeamLineupService,
    private router: Router,
    private route: ActivatedRoute,
    private title: TitleService,
    private mlbService: MlbService
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamNameParam = params['team_name'];
      this.handleResponse(this.route.snapshot.data['teamLineup']);
    });
    this.subscriptions.push(
      this.teamLineupService.indTeamDataWasChanged.subscribe(res => {
        this.handleResponse(res.data, res.year, res.heading);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // router link active fix;
  isLinkActive(url: string): boolean {
    return (
      ('/' + this.route.snapshot.url.join('/')) === url ||
      ('/mlb/' + this.route.snapshot.url.join('/')) === url
    );
  }

  performActionOnBreadcrumbClick(breadcrumb) {
    if (breadcrumb.key && breadcrumb.key === '/mlb/year' && breadcrumb.year) {
      this.mlbService.setPreSelectedGatewaySeason(breadcrumb.year);
    }
  }

  handleResponse(data, year?, heading?) {
    if (data && data.nav) {
      this.teamLineup = data;
      this.activeYear = year || this.teamLineupService.getPreSelectedTeamSeason() ||
        this.mlbService.getDefaultSeason(this.teamLineup.seasons_dropdown);
      this.isDefaultSeason = this.mlbService.checkIfDefaultSeason(this.activeYear, this.teamLineup.seasons_dropdown);
      const teamNameValue = this.teamLineup.nav.team_name_full;
      if (this.route.snapshot.data['pageType'] === 'injuries') {
        this.pageTitle = `${teamNameValue} Injuries`;
        this.pageName = 'Injuries';
      } else {
        this.title.setTitle(this.teamLineup.page_title);
        this.pageTitle = this.teamLineup.heading;
        this.pageName = 'Lineup';
      }
      // Determine whether a team is home or away
      this.currentTeamIsHome = this.teamLineup.nav.is_home;
    } else if (heading) {
      this.pageTitle = heading;
    }
  }
}
