import { Component } from '@angular/core';

@Component({
  selector: 'app-no-stats',
  template: `
    <div class="no-stats-cap">
      2019-20 Regular Season Hasn't Started. Select Last Year (2018-19)  for Stats
    </div>
  `
})
export class NoStatsComponent {
  constructor(
  ) { }
}
