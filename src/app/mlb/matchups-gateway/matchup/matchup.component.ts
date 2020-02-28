import { Component, Input, OnInit } from '@angular/core';
import { MatchupsGatewayService } from '../matchups-gateway.service';
import { TeamLineupService } from '../../team-lineup/team-lineup.service';

@Component({
  selector: 'app-matchup',
  templateUrl: './matchup.component.html',
  styleUrls: ['./matchup.component.scss']
})
export class MatchupComponent implements OnInit {
  @Input() header;
  @Input() gateway;
  @Input() status;
  @Input() gameId;
  @Input() isIndividual = false; // ind view
  @Input() isIndividualPage = false; // ind page
  @Input() noFollow = false;
  @Input() nav;
  @Input() season;

  chartsVisible = false;

  // lineChart
  lineChartData: any;

  constructor(
    private teamLineupService: TeamLineupService
  ) { }

  ngOnInit() {
    if (this.gateway && this.gateway.moneyline_history && this.gateway.total_history) {
      this.lineChartData = {
        moneyline: {
          data: [
            {data: this.gateway.moneyline_history.away || [], label: this.header.away.away_full_name},
            {data: this.gateway.moneyline_history.home || [], label: this.header.home.home_full_name}
          ],
          dates: this.gateway.moneyline_history.dates
        },
        total: {
          data: [{data: this.gateway.total_history.home || [], label: this.header.home.home_full_name}],
          dates: this.gateway.total_history.dates
        }
      };
    }
  }

  onLineClick() {
    this.chartsVisible = !this.chartsVisible;
  }

  onCloseChartsClick() {
    this.chartsVisible = false;
  }

  isWinner(teamScore, oppScore) {
    return parseInt(teamScore, 10) > parseInt(oppScore, 10);
  }

  preselectTeamSeason() {
    if (this.season) {
      this.teamLineupService.setPreSelectedTeamSeason(this.season);
    }
  }
}
