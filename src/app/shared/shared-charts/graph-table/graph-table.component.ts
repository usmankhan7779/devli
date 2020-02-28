import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { TimeZoneService } from '../../services/time-zone.service';

@Component({
  selector: 'app-graph-table',
  templateUrl: './graph-table.component.html',
  styleUrls: ['./graph-table.component.scss']
})
export class GraphTableComponent implements OnInit {
  @Input() isIndividualMatchup = false;
  @Input() customTable = false;
  @Input() tableName: string;
  @Input() homeTeamName: string;
  @Input() awayTeamName: string;
  @Input() datasets: Array<any>;
  @Input() set labels(value) {
    setTimeout(() => {
      this._labels = value;
    }, 0);
  }
  @Input() showLabels: Array<boolean>;
  @Input() awayOpen: string;
  @Input() awayCurrent: string;
  @Input() awayChange: string;
  @Input() homeOpen: string;
  @Input() homeCurrent: string;
  @Input() homeChange: string;
  @Input() league: string;
  @Input() bordered = true;
  @Input() homeLogo: string;
  @Input() awayLogo: string;
  @Input() chartClassWrapper = 'col-md-4 col-12';

  _labels: Array<any>;
  timeZone = this.timeZoneService.getTimeZoneAbbr();

  @Input() options: any = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: false,
      callbacks: {
        title: (tooltip) => {
          return moment(this._labels[tooltip[0].index]).format('h:mm a').toLowerCase() + ' ' +
            this.timeZone + ', ' + moment(this._labels[tooltip[0].index]).format('M/D');
        }
      }
    },
    scales: {
      xAxes: [{
        gridLines: {
          offsetGridLines: true,
        },
        ticks: {
          autoSkip : false,
          // maxRotation: 0,
          callback: (value, index) => {
            if (this.showLabels && this.showLabels[index]) {
              if (window && window.innerWidth < 800) {
                return moment(value).format('h:mm a').toLowerCase();
              }
              return moment(value).format('h:mm a').toLowerCase() + ' ' + this.timeZone + ', ' + moment(value).format('M/D');
            }
            return '';
          }
        }
      }]
    },
    plugins: {
      datalabels: {
        display: false
      }
    }
  };

  @Input() colors: Array<any>;
  @Input() legend = false;
  @Input() chartType = 'line';

  constructor(
    private timeZoneService: TimeZoneService
  ) {}

  ngOnInit() {
    if (!this.colors) {
      this.colors = [];
      if (this.awayTeamName) {
        this.colors.push({
          backgroundColor: 'transparent',
          borderColor: '#ff6384',
          pointBackgroundColor: '#ff6384',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#ff6384'
        });
      }
      if (this.homeTeamName) {
        this.colors.push({
          backgroundColor: 'transparent',
          borderColor: '#36a2eb',
          pointBackgroundColor: '#36a2eb',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#36a2eb'
        });
      }
    }
  }

}
