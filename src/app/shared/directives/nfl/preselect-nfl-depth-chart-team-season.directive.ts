import { Directive, HostListener, Input } from '@angular/core';
import { DepthChartService } from '../../../nfl/depth-charts/depth-chart.service';

@Directive({
  selector: '[appPreselectNflDepthChartTeamSeason]'
})
export class PreselectNflDepthChartTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectNflDepthChartTeamSeason') season: string;
  constructor(
    private depthChartService: DepthChartService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.depthChartService.setPreSelectedTeamSeason(this.season);
    }
  }
}
