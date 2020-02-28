import { Component, Input, OnInit } from '@angular/core';
import { TimeZoneService } from '../../../shared/services/time-zone.service';

@Component({
  selector: 'app-depth-chart-single-item',
  templateUrl: './depth-chart-single-item.component.html',
  styleUrls: ['./depth-chart-single-item.component.scss']
})
export class DepthChartSingleItemComponent implements OnInit {
  @Input() depthChart;
  @Input() index: number;
  @Input() notFullMatchupUrl = false;
  @Input() totalItemsLength: number;
  @Input() sportActionActive = true;
  @Input() fantasyActionActive = false;
  @Input() draftKingsActionActive = true;
  @Input() fanDuelActionActive = false;
  @Input() yahooActionActive = false;
  timeZone = this.timeZoneService.getTimeZoneAbbr();

  constructor(
    private timeZoneService: TimeZoneService
  ) { }

  ngOnInit() {
  }

  checkIfNA(value) {
    return (value || value === 0 ) && value !== 'N/A';
  }
}
