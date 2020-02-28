import { Component, Input, OnInit } from '@angular/core';
import { NbaService } from '../../nba.service';
import { TeamLineupService } from '../../team-lineup/team-lineup.service';

@Component({
  selector: 'app-matchup',
  templateUrl: './matchup.component.html',
  styleUrls: ['./matchup.component.scss']
})
export class MatchupComponent implements OnInit {
  @Input() gameId;
  @Input() header;
  @Input() gateway;
  @Input() status;
  @Input() noFollow = false;
  @Input() homeConfirmed: boolean;
  @Input() homeRecord;
  @Input() awayConfirmed: boolean;
  @Input() awayRecord;
  @Input() season;

  @Input() isIndividual = false; // ind view
  @Input() isIndividualPage = false; // ind page

  chartsVisible = false;

  // lineChart
  lineChartData: any;

  constructor(
    private nbaService: NbaService,
    private teamLineupService: TeamLineupService
  ) {
  }

  ngOnInit() {
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

  showHalftime(status) {
    return this.nbaService.showHalftime(status);
  }

  preselectTeamSeason() {
    if (this.season) {
      this.teamLineupService.setPreSelectedTeamSeason(this.season);
    }
  }

}
