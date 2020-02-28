import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CreditCardService } from '../../shared/services/credit-card.service';
import { MyAccountService } from './my-account.service';
import { Subscription } from 'rxjs';
import { PricingService } from '../../shared/services/pricing.service';
import { AuthService } from '../../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit, OnDestroy {
  activeSubscription: any;
  activeCreditCard: any;
  isFreePlan: boolean;
  noCreditCard: boolean;

  planChangedSubscription: Subscription;
  cardChangedSubscription: Subscription;
  loginSubscription: Subscription;

  constructor(
    private creditCardService: CreditCardService,
    private authService: AuthService,
    private myAccountService: MyAccountService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.cardChangedSubscription = this.myAccountService.cardWasChanged.subscribe(() => {
      this.creditCardService.getCreditCard()
        .subscribe((res: any) => {
          res.cards = res.cards.sort((a, b) => {
            if (a && b) {
              return b.id - a.id;
            }
            return 0;
          });
          console.log('getCreditCard', res);
          this.activeCreditCard = res.cards[0];
          if (!this.activeCreditCard) {
            this.noCreditCard = true;
          }
        });
    });
    this.planChangedSubscription = this.myAccountService.planWasChanged.subscribe(() => {
      this.creditCardService.getMySubscriptions()
        .subscribe((res) => {
          console.log('getMySubscriptions', res);
          if (res && res[0]) {
            this.activeSubscription = res[0];
          } else {
            this.isFreePlan = true;
          }
        });
    });
    this.loginSubscription = this.authService.loginCallback.subscribe(() => {
      this.initActions();
    });

    if (isPlatformBrowser(this.platformId)) {
      this.initActions();
    }
  }

  ngOnDestroy() {
    this.planChangedSubscription.unsubscribe();
    this.cardChangedSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }

  initActions() {
    this.myAccountService.updatePlan();
    this.myAccountService.updateCard();
  }

}
