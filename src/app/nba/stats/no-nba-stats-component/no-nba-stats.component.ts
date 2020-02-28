import { Component } from '@angular/core';

@Component({
  selector: 'app-no-nba-stats',
  template: `
    <div class="no-stats-cap">
      2019-20 Regular Season Hasn't Started. Select Last Year (2018-19)  for Stats
    </div>
  `
})
export class NoNbaStatsComponent {
  constructor(
  ) { }
}
