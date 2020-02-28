import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ScoreBarHelperService } from '../../../score-bar/score-bar-helper.service';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html'
})
export class GameViewComponent implements OnInit, OnDestroy {
  gameId: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scoreBarService: ScoreBarHelperService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.scoreBarService.hideScorebar();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.route.params.subscribe((params: Params) => {
        this.gameId = this.route.snapshot.params['gameId'];
        if (!this.gameId) {
          this.onCloseGame();
        }
      });
    }
  }

  ngOnDestroy() {
    this.scoreBarService.showScorebar();
  }

  onCloseGame() {
    this.router.navigate(['/nfl/simulator']);
  }

}
