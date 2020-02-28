import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash'
@Component({
  selector: 'app-win-probability-chart',
  templateUrl: './win-probability-chart.component.html',
  styleUrls: ['./win-probability-chart.component.scss']
})
export class WinProbabilityChartComponent implements OnChanges {
  datasets;
  labels = [];
  private firstQuarterTime = 900;
  private secondQuarterTime = 1800;
  private thirdQuarterTime = 2700;
  private fourthQuarterTime = 3600;
  @Input() finalScore = false;
  @Input() league; // mlb | nfl
  @Input() homeTeamName: string;
  @Input() awayTeamName: string;
  @Input() homeLogo: string;
  @Input() awayLogo: string;
  @Input() awayCurrentProb: number;
  @Input() homeCurrentProb: number;
  @Input() awayChangeProb: number;
  @Input() homeChangeProb: number;
  @Input() awayFinalScorePrediction: number;
  @Input() homeFinalScorePrediction: number;
  @Input() awayFirstHalfScorePrediction: number;
  @Input() homeFirstHalfScorePrediction: number;
  @Input() homeWinProbability: Array<any>;
  @Input() awayWinProbability: Array<any>;
  @Input() time: Array<any>;
  @Input() colors: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: '#b22028',
      pointBackgroundColor: '#b22028',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#b22028'
    },
    {
      backgroundColor: 'transparent',
      borderColor: '#3b5d98',
      pointBackgroundColor: '#3b5d98',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3b5d98'
    }
  ];
  @Input() legend = false;
  @Input() chartType = 'line';

  @Input() options: any = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false
          }
        }
      ],
      xAxes: [{
        gridLines: {
          // offsetGridLines: true,
          display: false
        },
        ticks: {
          autoSkip : false,
          maxRotation: 0,
        }
      }]
    }
  };



  constructor() {}

  ngOnChanges() {
    if (Array.isArray(this.time) && Array.isArray(this.homeWinProbability) && Array.isArray(this.awayWinProbability)) {
      const {time, home, away} = this.prepareArrays(this.time, this.homeWinProbability, this.awayWinProbability);
      const pointRadius = time.map((timeVal) => {
        if (timeVal === this.firstQuarterTime ||
          timeVal === this.secondQuarterTime ||
          timeVal === this.thirdQuarterTime ||
          timeVal === this.fourthQuarterTime) {
          return 3; // point radius
        }
        return 0; // point radius is 0 => no point
      });
      this.labels = time.map((timeVal) => {
        switch (timeVal) {
          case this.firstQuarterTime:
            return '1st';
          case this.secondQuarterTime:
            return '2nd';
          case this.thirdQuarterTime:
            return '3rd';
          case this.fourthQuarterTime:
            return '4th';
          default:
            return '';
        }
      });
      this.datasets = [
        {
          pointRadius: pointRadius,
          data: away,
          label: this.awayTeamName
        },
        {
          pointRadius: pointRadius,
          data: home,
          label: this.homeTeamName
        }
      ];
    }
  }

  private prepareArrays(time, home, away) {
    const resArrays = [
      {
        time: [],
        home: [],
        away: []
      },
      {
        time: [],
        home: [],
        away: []
      },
      {
        time: [],
        home: [],
        away: []
      },
      {
        time: [],
        home: [],
        away: []
      }
    ];
    time.forEach((item, index) => {
      if (item <= this.firstQuarterTime) {
        resArrays[0].time.push(item);
        resArrays[0].home.push(home[index]);
        resArrays[0].away.push(away[index]);
      } else if (item <= this.secondQuarterTime) {
        resArrays[1].time.push(item);
        resArrays[1].home.push(home[index]);
        resArrays[1].away.push(away[index]);
      } else if (item <= this.thirdQuarterTime) {
        resArrays[2].time.push(item);
        resArrays[2].home.push(home[index]);
        resArrays[2].away.push(away[index]);
      } else if (item <= this.fourthQuarterTime) {
        resArrays[3].time.push(item);
        resArrays[3].home.push(home[index]);
        resArrays[3].away.push(away[index]);
      }
    });

    this.checkQuarters(resArrays, 0, this.firstQuarterTime);
    this.checkQuarters(resArrays, 1, this.secondQuarterTime);
    this.checkQuarters(resArrays, 2, this.thirdQuarterTime);
    this.checkQuarters(resArrays, 3, this.fourthQuarterTime);

    const maxArr = resArrays.reduce((previousValue, currentValue) => {
      return previousValue.time.length > currentValue.time.length ? previousValue : currentValue;
    });
    resArrays.forEach((item, index, arr) => {
      if (item.time.length !== maxArr.time.length) {
        while (item.time.length !== maxArr.time.length) {
          item.time.unshift(null);
          item.home.unshift(item.home[0] || null);
          item.away.unshift(item.away[0] || null);
        }
        arr[index] = item;
      }
    });
    return {
      time: _.concat(resArrays[0].time, resArrays[1].time, resArrays[2].time, resArrays[3].time),
      home: _.concat(resArrays[0].home, resArrays[1].home, resArrays[2].home, resArrays[3].home),
      away: _.concat(resArrays[0].away, resArrays[1].away, resArrays[2].away, resArrays[3].away)
    };
  }

  private checkQuarters(resArrays, quarter, quarterTime) {
    if (resArrays[quarter].time.indexOf(quarterTime) === -1) {
      resArrays[quarter].time.push(quarterTime);
      resArrays[quarter].home.push(null);
      resArrays[quarter].away.push(null);
    }
  }
}
