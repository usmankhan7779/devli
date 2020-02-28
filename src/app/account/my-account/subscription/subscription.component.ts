import { Component, Inject, Injector, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UpdateSubscriptionComponent } from '../update-subscription/update-subscription.component';
import { CreditCardService } from '../../../shared/services/credit-card.service';
import { NotificationModalComponent } from '../../../shared/modals/notification-modal/notification-modal';
import { MyAccountService } from '../my-account.service';
import { isPlatformBrowser } from '@angular/common';
import { TimeZoneService } from '../../../shared/services/time-zone.service';

@Component({
  selector: 'app-account-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  @Input() activeSubscription: any = false;
  @Input() activeCreditCard: any = false;
  date = new Date;
  private modalService;
  constructor(
    private timeZoneService: TimeZoneService,
    private creditCardService: CreditCardService,
    private myAccountService: MyAccountService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService = this.injector.get(NgbModal);
    }
  }

  ngOnInit() {

  }

  onChangePlan() {
    const modalRef = this.modalService.open(UpdateSubscriptionComponent, {size: 'lg'});
    modalRef.componentInstance.plan_id = this.activeSubscription &&
    this.activeSubscription.plan &&
    this.activeSubscription.plan.stripe_id ? this.activeSubscription.plan.stripe_id : false;
  }

  onCancelPlan() {
    const modalRef = this.modalService.open(NotificationModalComponent, {
      size: 'lg',
      windowClass: `lineups-custom-modal notification-modal md`
    });
    modalRef.componentInstance.btn = 'Confirm';
    modalRef.componentInstance.text = 'You are about to cancel this plan, please confirm.';
    modalRef.componentInstance.header = 'Cancel Plan';
    modalRef.result.then((result) => {
      this.creditCardService.unsubscribeFromPlan(this.activeSubscription.plan.stripe_id)
        .subscribe(res => {
          this.myAccountService.updatePlan();
        });
    });
  }

  getTimezoneName() {
    return this.timeZoneService.getTimeZoneAbbr();
  }
}
