import { Component, Input, OnInit } from '@angular/core';
import { NbaService } from '../../nba.service';

@Component({
  selector: 'app-nba-no-stats',
  template: `
    <div class="no-stats-cap">
      <!--<ng-container *ngIf="season; else noSeasonTpl">-->
        <!--{{season}} Regular Season Hasn't Started. Select Last Year ({{pastSeason}}) for Stats-->
      <!--</ng-container>-->
      <!--<ng-template #noSeasonTpl>-->
        <!--NBA Season Hasn't Started Yet.-->
      <!--</ng-template>-->
    </div>
  `
})
export class NBAnoStatsComponent implements OnInit {
  @Input() year;
  season: string;
  pastSeason: string;
  constructor(
    private nbaService: NbaService
  ) { }

  ngOnInit() {
    if (this.year && parseInt(this.year, 10) > 1) {
      this.season = this.nbaService.handleYear(parseInt(this.year, 10));
      this.pastSeason = this.nbaService.handleYear(parseInt(this.year, 10) - 1);
    }
  }
}
