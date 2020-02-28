
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SimulatorMetricsService {
  simulatorMetricsChanged = new Subject();

  constructor(
  ) { }

  changeMetrics(homeMetrics, awayMetrics, generalMetrics, updateData = true) {
    const homeActiveMetrics = {
      seasons: this.getActiveMetric(homeMetrics, 'seasons'),
      teams: this.getActiveMetric(homeMetrics, 'teams'),
      tactic: this.getActiveMetric(homeMetrics, 'tactic'),
    };
    const awayActiveMetrics = {
      seasons: this.getActiveMetric(awayMetrics, 'seasons'),
      teams: this.getActiveMetric(awayMetrics, 'teams'),
      tactic: this.getActiveMetric(awayMetrics, 'tactic'),
    };
    const generalActiveMetrics = {
      weather: this.getActiveMetric(generalMetrics, 'weather'),
    };
    this.simulatorMetricsChanged.next({
      homeActiveMetrics,
      awayActiveMetrics,
      generalActiveMetrics,
      updateData
    });
  }

  private getActiveMetric(metrics, metricName) {
    const metric = _.find(metrics[metricName], {selected: true});
    return metric;
  }

}
