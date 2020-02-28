import { Directive, HostListener, Input } from '@angular/core';
import { DepthChartService } from '../../../nba/depth-charts/depth-chart.service';

@Directive({
  selector: '[appPreselectNbaDepthChartTeamSeason]'
})
export class PreselectNbaDepthChartTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectNbaDepthChartTeamSeason') season: string;
  constructor(
    private depthChartService: DepthChartService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.depthChartService.setPreSelectedTeamSeason(this.season);
    }
  }
}
