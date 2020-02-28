
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { PricingService } from '../../../shared/services/pricing.service';
import * as _ from 'lodash';
import { CreditCardService } from '../../../shared/services/credit-card.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MyAccountService } from '../my-account.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-update-subscription',
  templateUrl: './update-subscription.component.html',
  styleUrls: ['./update-subscription.component.scss']
})
export class UpdateSubscriptionComponent implements OnInit {
  plan_id;
  selectedPlan;
  currentPlan;
  allPlans;

  constructor(
    private spinnerService: SpinnerService,
    public  activeModal: NgbActiveModal,
    private pricingService: PricingService,
    private myAccountService: MyAccountService,
    private creditCardService: CreditCardService,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    const allPlans = _.concat(
      // [this.pricingService.free_plan],
      _.values(this.pricingService.dailyFantasyPlanOptions),
      _.values(this.pricingService.bettingPlanOptions)
    );
    if (this.plan_id) {
      const currentPlanIndex = _.findIndex(allPlans, {
        stripe_id: this.plan_id
      });
      this.currentPlan = allPlans[currentPlanIndex];
      allPlans.splice(currentPlanIndex, 1);
    } else {
      this.currentPlan = this.pricingService.free_plan;
    }
    this.allPlans = allPlans.slice(0);
  }

  selectPlan(plan) {
    this.selectedPlan = plan;
  }

  updatePlan() {
    console.log('Plan Updated to', this.selectedPlan);
    let updatePlanCall;
    if (this.currentPlan && this.currentPlan.type !== this.pricingService.free_plan.type) {
      updatePlanCall = this.creditCardService.changePlan(this.selectedPlan.stripe_id)
    } else {
      updatePlanCall = this.creditCardService.subscribeToPlan(this.selectedPlan.stripe_id)
    }
    this.spinnerService.handleAPICall(updatePlanCall).pipe(
      catchError(err => {
        this.activeModal.close();
        this.commonService.showNotification('Sorry an error occurred, plan was not updated.');
        return observableThrowError(err);
      }))
      .subscribe(res => {
        console.log('Subscribed', res);
        this.myAccountService.updatePlan();
        this.activeModal.close();
      });
  }

}
