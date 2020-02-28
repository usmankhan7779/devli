import {Component, OnDestroy, OnInit} from '@angular/core';
import {BetMetricsService} from './bet-metrics.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Parameter} from '../../shared/models/parameter';
import {BetMetricsObject} from '../../shared/models/bet-metrics-object';


@Component({
  selector: 'app-bet-metrics',
  templateUrl: './bet-metrics.component.html',
  styleUrls: ['./bet-metrics.component.css']
})
export class BetMetricsComponent implements OnInit {

  betMetrics: BetMetricsObject;
  parameters: Parameter[];
  isSubmitting: boolean;

  private routeSubscription: Subscription;

  constructor(
    private router: Router,
    private betMetricsService: BetMetricsService,
    private activatedRoute: ActivatedRoute
  ) {
    // Defaults
    this.parameters = [
      {name: 'bet_id', title: 'Bet Type', value: 1},
      {name: 'model', title: 'Model', value: 'nb'},
      {name: 'outcome', title: 'Outcome', value: 1},
      {name: 'win_prob_max', title: 'Win Prob Max', value: 1},
      {name: 'win_prob_min', title: 'Win Prob Min', value: 0},
      {name: 'ev_max', title: 'EV Max', value: 1},
      {name: 'ev_min', title: 'EV Min', value: -1},
      {name: 'scale', title: 'Scale', value: true}
    ];
  }

  ngOnInit() {
    this.getMlbBetMetrics();
  }

  onParametersSubmit() {
    this.resetBetMetrics();
    this.getMlbBetMetrics();
  }

  private afterDataReceived(betMetrics: BetMetricsObject) {
    this.betMetrics = betMetrics;
    this.isSubmitting = false;
  }

  private getMlbBetMetrics() {
    this.isSubmitting = true;
    return this.betMetricsService.mlbBetMetrics(this.parameters)
    .subscribe(betMetrics => this.afterDataReceived(betMetrics));
  }

  private resetBetMetrics() {
    this.betMetrics.reset();
  }

  // onChangeYear(selectedYear) {
  //   this.activeYear = selectedYear;
  //   this.router.navigateByUrl(`/mlb/lineups/${this.activeYear}/${this.teamNameValue}`);
  //   // TODO: Make new api request
  // }
  //

}
