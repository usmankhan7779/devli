import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ScoreBarHelperService {
  scorebarLeagueChanged = new Subject<string>();
  scorebarValueChanged = new Subject<boolean>();
  mlbScoreArrUpdated = new Subject<any[]>();
  nbaScoreArrUpdated = new Subject<any[]>();
  scoreBarReadyEvent = new Subject<any[]>();
  firedMlbUpdate = new Subject<any[]>();
  scorebarHidden = false;
  scoreBarReady = false;

  constructor(
    private router: Router
  ) { }

  changeScorebarLeague(league) {
    this.scorebarLeagueChanged.next(league);
  }

  onScoreBarReady() {
    if (this.scoreBarReady) {
      return;
    }
    this.scoreBarReady = true;
    this.scoreBarReadyEvent.next();
  }

  updateSorebarLeague(url = null) {
    if (!this.scoreBarReady) {
      return;
    }
    url = url || this.router.url;
    if (url.startsWith('/mlb')) {
      this.changeScorebarLeague('mlb');
    } else if (url.startsWith('/nfl')) {
      this.changeScorebarLeague('nfl');
    } else if (url.startsWith('/nba')) {
      this.changeScorebarLeague('nba');
    } else {
      this.changeScorebarLeague('nfl');
    }
  }

  showScorebar() {
    this.scorebarHidden = false;
    this.scorebarValueChanged.next(this.scorebarHidden);
  }

  hideScorebar() {
    this.scorebarHidden = true;
    this.scorebarValueChanged.next(this.scorebarHidden);
  }

  fireMlbUpdate() {
    this.firedMlbUpdate.next();
  }
}
