import {Component, Input, OnInit} from '@angular/core';
import { DepthChartService } from '../../depth-charts/depth-chart.service';

@Component({
  selector: 'app-matchup',
  templateUrl: './matchup.component.html',
  styleUrls: [
    './matchup.component.scss'
  ]
})
export class MatchupComponent implements OnInit {
  @Input() header;
  @Input() gateway;
  @Input() status;
  @Input() nav;
  @Input() gameId;
  @Input() noFollow = false;
  @Input() season;
  @Input() isIndividual = false; // ind view
  @Input() isIndividualPage = false; // ind page

  homeRedirectUrl: string;
  awayRedirectUrl: string;

  chartsVisible = false;

  // lineChart
  lineChartData: any;

  constructor(private depthChartService: DepthChartService) {}

  ngOnInit() {
    this.homeRedirectUrl = this.gateway.home.depth_chart_route || this.header.home.depth_chart_route ||
      (this.nav && this.nav.home_team_depth_chart_route);
    this.awayRedirectUrl = this.gateway.away.depth_chart_route || this.header.away.depth_chart_route ||
      (this.nav && this.nav.away_team_depth_chart_route);
    this.lineChartData = {
      moneyline: {
        data: [
          {data: this.gateway.moneyline_history.away || [], label: this.header.away.away_full_name},
          {data: this.gateway.moneyline_history.home || [], label: this.header.home.home_full_name}
        ],
        dates: this.gateway.moneyline_history.dates
      },
      total: {
        data: [
          {data: this.gateway.total_history.away || [], label: this.header.away.away_full_name},
          {data: this.gateway.total_history.home || [], label: this.header.home.home_full_name}
        ],
        dates: this.gateway.total_history.dates
      },
      spread: {
        data: [
          {data: this.gateway.spread_history.away || [], label: this.header.away.away_full_name},
          {data: this.gateway.spread_history.home || [], label: this.header.home.home_full_name}
        ],
        dates: this.gateway.spread_history.dates
      }
    };
  }

  onLineClick() {
    this.chartsVisible = !this.chartsVisible
  }

  onCloseChartsClick() {
    this.chartsVisible = false;
  }

  getLogoRoute(team: 'home' | 'away') {
    return this.header[team].white_logo || '/assets/images/nfl/logos/white/' + this.header[team][team + '_route'] + '-white.svg';
  }

  preselectTeamSeason() {
    if (this.season) {
      this.depthChartService.setPreSelectedTeamSeason(this.season);
    }
  }
}
