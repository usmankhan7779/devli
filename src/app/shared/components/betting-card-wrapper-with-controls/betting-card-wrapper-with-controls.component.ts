import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { BetPredictorService } from '../../../mlb/bet-predictor/bet-predictor.service';
import { NflBetPredictorService } from '../../../nfl/bet-predictor/bet-predictor.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-betting-card-wrapper-with-controls',
  templateUrl: './betting-card-wrapper-with-controls.component.html',
  styleUrls: ['./betting-card-wrapper-with-controls.component.scss'],
})
export class BettingCardWrapperWithControlsComponent {
  @Input() set cards(cards) {
    try {
      this._cards = this.commonService.prepareBettingCards(cards);
    } catch (err) {
      console.error('error while receiving cards BettingCardWrapperWithControlsComponent');
      this._cards = [];
    }
  };
  @Input() gameId: number;
  @Input() visibleByGoogle = false;
  @Input() league: 'mlb' | 'nfl';
  @Input() allowServerRender = false;
  @Input() isMatchupsGatewayPage = false;
  @Input() status: any;
  _cards = [];
  isBrowser: boolean;
  currentIndex = 0;
  constructor(
    private betPredictorService: BetPredictorService,
    private nflBetPredictorService: NflBetPredictorService,
    private commonService: CommonService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  nextIndex() {
    if (this.currentIndex >= this._cards.length - 1) {
      return this.currentIndex = 0;
    }
    return this.currentIndex++;
  }
  prevIndex() {
    if (this.currentIndex <= 0) {
      return this.currentIndex = this._cards.length - 1;
    }
    return this.currentIndex--;
  }

  onPredictorClick(id) {
    if (this.league === 'mlb') {
      this.betPredictorService.setPreSelectedGameId(id);
      this.router.navigate(['/mlb/betting-system']);
    } else {
      // this.betPredictorService.setPreSelectedGameId(id);
      this.router.navigate(['/nfl/betting-system']);
    }
  }
}
