import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss']
})
export class PlayerStatsComponent implements OnInit {
  statsRadioBtn = {
    all: true,
    qb: false,
    wr: false,
    rb: false,
    te: false,
    def: false,
    k: false
  };
  constructor() { }

  ngOnInit() {
  }

  onStatsRadioBtnClick(btnName: string) {
    for (const key in this.statsRadioBtn) {
      if (this.statsRadioBtn.hasOwnProperty(key) && this.statsRadioBtn[key]) {
        this.statsRadioBtn[key] = false;
      }
    }
    this.statsRadioBtn[btnName] = true;
  }

}
