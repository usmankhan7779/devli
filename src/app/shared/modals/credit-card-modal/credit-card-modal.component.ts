
/*

import { throwError as observableThrowError,  Subscription, Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreditCardService } from '../../services/credit-card.service';
import { AuthService } from '../../../auth/auth.service';
import { SpinnerService } from '../../components/spinner/spinner.service';

@Component({
  selector: 'app-credit-card-modal',
  templateUrl: './credit-card-modal.component.html',
  styleUrls: ['./credit-card-modal.component.scss']
})
export class CreditCardModalComponent implements OnInit, OnDestroy {
  newPrice;
  promoCodeVerified = null;
  loginSubscription: Subscription;
  ccPaymentForm: FormGroup;
  selectedPlan: any;
  isAuthenticated: boolean;
  currentYear = new Date().getFullYear();
  expMonthOpts = this.creditCardService.expMonthOpts;
  usStates = this.creditCardService.usStates;
  expYearOpts: number[] = [];
  // Modal Data
  // ** Passed in from .componentInstance on component opened from
  userEmail = '';
  errorMessage = '';
  activeSubscription: any = false;

  constructor(
    public  activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private creditCardService: CreditCardService,
    private ngZone: NgZone,
    private authService: AuthService,
    private spinnerService: SpinnerService
  ) {
    // Set Initial Expiration year Options
    for (let i = 0; i < 8; i++) {
      this.expYearOpts.push(this.currentYear +  i);
    }
    // Set Inital CC Payment Form Value
    this.ccPaymentForm = this.formBuilder.group({
      'ccFullName': [null, [ Validators.compose([
          Validators.required
        ])
      ]],
      'ccNumber': [null, [ Validators.compose([
          Validators.required
        ])
      ]],
      'expMonth': [null, [ Validators.compose([
          Validators.required,
          this.selectedOptionIsEqualDefault.bind(this)
        ])
      ]],
      'expYear': [null, [ Validators.compose([
          Validators.required,
          this.selectedOptionIsEqualDefault.bind(this)
        ])
      ]],
      'cvvCode': [null, [ Validators.compose([
          Validators.required,
          this.selectedOptionIsEqualDefault.bind(this)
        ])
      ]],
      'ccBillingAddress': [null, [ Validators.compose([
          Validators.required,
          this.selectedOptionIsEqualDefault.bind(this)
        ])
      ]],
      'ccAptNumber': [null],
      'ccCity': [null, [ Validators.compose([
          Validators.required
        ])
      ]],
      'ccState': [null, [ Validators.compose([
          Validators.required,
          this.selectedOptionIsEqualDefault.bind(this)
        ])
      ]],
      'ccZipCode': [null, [ Validators.compose([
          Validators.required
        ])
      ]],
      'promoCode': [null]
    });
  }

  ngOnInit() {
    this.loginSubscription = this.authService.loginCallback.subscribe(() => {
      this.errorMessage = '';
      this.initActions();
    });
    this.initActions();
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

  private initActions() {
    this.isAuthenticated = this.authService.isLoggedIn();
    if (this.isAuthenticated) {
      this.ccPaymentForm.get('promoCode').enable();
      this.creditCardService.getMySubscriptions()
        .subscribe((res) => {
          console.log('getMySubscriptions', res);
          if (res && res[0]) {
            this.activeSubscription = res[0];
          } else {
            this.activeSubscription = false;
          }
        });
    } else {
      this.ccPaymentForm.get('promoCode').disable();
    }
    this.userEmail = this.authService.getEmail();
  }

  showLoginModal() {
    this.authService.showLoginPopup({
      windowClass: 'top-modal-on-cc-modal'
    });
  }

  showSignUpModal() {
    this.authService.showSignUpPopup({
      windowClass: 'top-modal-on-cc-modal'
    });
  }

  selectedOptionIsEqualDefault(control: FormControl) {
    if (!this.ccPaymentForm) {
      return true;
    }
    if (control.value === null) {
      return true;
    } else {
      return false;
    }
  }

  onSubmitForm(ccPaymentForm) {
    console.log(ccPaymentForm);
    if (!ccPaymentForm.valid) {
      this.errorMessage = 'Form data is invalid, fill in all required fields';
    } else if (!this.isAuthenticated) {
      this.errorMessage = 'Please Sign Up or Sign In to Start Winning';
    } else if (ccPaymentForm.valid) {
      this.errorMessage = '';
      this.setCreditCard(ccPaymentForm);
    }
  }

  private setCreditCard(ccPaymentForm) {
    this.spinnerService.showSpinner();
    this.creditCardService.createCreditCardToken({
      number: ccPaymentForm.value.ccNumber,
      exp_month: ccPaymentForm.value.expMonth,
      exp_year: ccPaymentForm.value.expYear,
      cvc: ccPaymentForm.value.cvvCode,
      name: ccPaymentForm.value.ccFullName,
      address_line1: ccPaymentForm.value.ccBillingAddress,
      address_line2: ccPaymentForm.value.ccAptNumber || '',
      address_city: ccPaymentForm.value.ccCity,
      address_state: ccPaymentForm.value.ccState,
      address_zip: ccPaymentForm.value.ccZipCode,
      address_country: 'US'
    }, (status: number, response: any) => {
      console.log('status', status);
      console.log('response', response);
      // Wrapping inside the Angular zone
      this.ngZone.run(() => {
        if (status === 200) {
          console.log(`Success! token ${response.id}.`);
          console.log(`Success! Card token ${response.card.id}.`);
          this.creditCardService.setCreditCard(response.id)
            .subscribe((res) => {
              console.log('res', res);
              this.subscribeToPlan();
            });
        } else {
          this.spinnerService.hideSpinner();
          console.log(response.error.message);
          if (response && response.error && response.error.message) {
            this.errorMessage = response.error.message;
          }
        }
      });
    });
  }

  onPromoCodeVerifyBtnClick(promoCode) {
    (<Observable<any>>this.creditCardService.verifyPromoCode(this.selectedPlan.stripe_id, promoCode)).pipe(
      catchError((err) => {
        this.promoCodeVerified = false;
        return observableThrowError(err);
      }))
      .subscribe((res) => {
        if (res && typeof res.new_price === 'number') {
          this.ccPaymentForm.get('promoCode').disable();
          this.promoCodeVerified = true;
          this.newPrice = res.new_price;
        } else {
          this.promoCodeVerified = false;
        }
      });
  }

  private subscribeToPlan() {
    const code = this.ccPaymentForm.get('promoCode').value;
    const promoCode = code && this.promoCodeVerified === true ? code : undefined;
    let subscribeToPlanApiCall;
    if (this.activeSubscription) {
      subscribeToPlanApiCall = this.creditCardService.changePlan(this.selectedPlan.stripe_id, promoCode);
    } else {
      subscribeToPlanApiCall = this.creditCardService.subscribeToPlan(this.selectedPlan.stripe_id, promoCode);
    }
    subscribeToPlanApiCall
      .finally(() => {
        this.spinnerService.hideSpinner();
      })
      .subscribe(res => {
        console.log('Subscribed', res);
        this.activeModal.close();
      }, (err) => {
        this.errorMessage = 'ERROR, You wasn\'t subscribed to the plan';
      });
  }


  _onlyNumbers(event: any) {
    console.log(event);
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

}

*/
