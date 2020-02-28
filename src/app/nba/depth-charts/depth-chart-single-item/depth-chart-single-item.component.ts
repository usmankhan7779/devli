import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-depth-chart-single-item',
  templateUrl: './depth-chart-single-item.component.html',
  styleUrls: ['./depth-chart-single-item.component.scss']
})
export class DepthChartSingleItemComponent implements OnInit {
  @Input() startersOnly: boolean;
  @Input() depthChart;
  @Input() posKeys: any;
  @Input() posKeysArr: string[];

  constructor(
  ) { }

  ngOnInit() {
  }

  defineIfLongName(player) {
    if (this.startersOnly) {
      return '';
    }
    if (player.name.length > 24) {
      return 'do-extra-small-team-name';
    }
    if (player.name.length > 22) {
      return 'do-small-2-team-name';
    }
    if (player.name.length > 19) {
      return 'do-small-1-team-name';
    }
    if (player.name.length > 17) {
      return 'do-small-team-name';
    }
    if (player.name.length > 12) {
      return 'long-team-name';
    }
    return '';
  }
}
