import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alternative-depth-chart-view',
  templateUrl: './alternative-depth-chart-view.component.html',
  styleUrls: [
    './../../../nba/depth-charts/depth-chart-single-item/depth-chart-single-item.component.scss',
    './alternative-depth-chart-view.component.scss'
  ]
})
export class AlternativeDepthChartViewComponent implements OnInit {
  @Input() depthChart;

  constructor(
  ) { }

  ngOnInit() {
  }
}
