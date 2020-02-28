import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScoreBarHelperService } from '../../../score-bar/score-bar-helper.service';

@Component({
  selector: 'app-team-lineup-heading-right',
  templateUrl: './team-lineup-heading-right.component.html',
  styleUrls: ['./team-lineup-heading-right.component.scss']
})
export class TeamLineupHeadingRightComponent implements OnInit, OnDestroy {
  realTimeSubscription: Subscription;
  @Input() nav;
  @Input() showUpdated = false;
  constructor(
    private scoreBarService: ScoreBarHelperService,
  ) { }

  ngOnInit() {
    this.subscribeOnRealTimeUpdate();
  }

  ngOnDestroy() {
    if (this.realTimeSubscription) {
      this.realTimeSubscription.unsubscribe();
    }
  }

  isWinner(teamScore, oppScore) {
    return parseInt(teamScore, 10) > parseInt(oppScore, 10);
  }

  private subscribeOnRealTimeUpdate() {
    this.realTimeSubscription = this.scoreBarService.mlbScoreArrUpdated
      .subscribe((data) => {
        const lineupStatus = data[this.nav.game_id];
        if (lineupStatus) {
          this.nav.status = lineupStatus;
        }
      });
  }

}
