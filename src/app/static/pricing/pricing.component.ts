import { Component, Inject, Injector, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Components
// import { CreditCardModalComponent } from '../shared/modals/credit-card-modal/credit-card-modal.component';
import { isPlatformBrowser } from '@angular/common';
import { PricingService } from '../../shared/services/pricing.service';

@Component({
  selector: 'app-pricing-page',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PricingComponent implements OnInit {
  // Main Page Toggle
  lineupsBettingActive: boolean;
  lineupsDailyFantasyActive: boolean;
  // Main Tab Menu Values
  threeDayTabActive: boolean;
  monthlyTabActive: boolean;
  sixMonthTabActive: boolean;
  yearlyTabActive: boolean;

  bettingPlanOptions = this.pricingService.bettingPlanOptions;

  dailyFantasyPlanOptions = this.pricingService.dailyFantasyPlanOptions;
  private modalService;

  constructor(
    private pricingService: PricingService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService = this.injector.get(NgbModal);
    }
    // Set Initial Main Page Toggles
    this.lineupsBettingActive = true;
    this.lineupsDailyFantasyActive = false;
    // Set Initial Pricing Tab Menu Values
    this.threeDayTabActive = false;
    this.monthlyTabActive = true;
    this.sixMonthTabActive = false;
    this.yearlyTabActive = false;
  }

  ngOnInit() {}

  /**
   *  Main Page Navigation Button Toggles
   *  -----------------------------------
   */
  onLineupsBetting() {
    this.lineupsBettingActive = true;
    this.lineupsDailyFantasyActive = false;
  }

  onLineupsDailyFantasy() {
    this.lineupsBettingActive = false;
    this.lineupsDailyFantasyActive = true;
  }

  /**
   *  Main Tab Menu Toggle Functions
   *  ------------------------------
   */
  onThreeDayTab() {
    this.threeDayTabActive = true;
    this.monthlyTabActive = false;
    this.sixMonthTabActive = false;
    this.yearlyTabActive = false;
  }

  onMonthlyTab() {
    this.threeDayTabActive = false;
    this.monthlyTabActive = true;
    this.sixMonthTabActive = false;
    this.yearlyTabActive = false;
  }

  onSixMonthTab() {
    this.threeDayTabActive = false;
    this.monthlyTabActive = false;
    this.sixMonthTabActive = true;
    this.yearlyTabActive = false;
  }

  onYearlyTab() {
    this.threeDayTabActive = false;
    this.monthlyTabActive = false;
    this.sixMonthTabActive = false;
    this.yearlyTabActive = true;
  }

  /**
   *  Credit Card Modal Action
   */
  onStartWinning(selectedPlan) {
    console.log('Credit Modal');
    // const modalRef = this.modalService.open(CreditCardModalComponent, {size: 'lg', windowClass: 'lineups-custom-modal modal-cozy'});
    // modalRef.componentInstance.selectedPlan = selectedPlan;
    // modalRef.result.then(
    //   closeVal => {},
    //   dismissVal => {
    //     console.log('Finished');
    //   }
    // );
  }
}
