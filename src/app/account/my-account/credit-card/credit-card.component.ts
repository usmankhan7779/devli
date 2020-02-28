import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreditCardService } from '../../../shared/services/credit-card.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { MyAccountService } from '../my-account.service';

@Component({
  selector: 'app-account-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {
  errorMessage: string;
  ccPaymentForm: FormGroup;
  currentYear = new Date().getFullYear();
  expMonthOpts = this.creditCardService.expMonthOpts;
  usStates = this.creditCardService.usStates;
  expYearOpts: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private creditCardService: CreditCardService,
    private ngZone: NgZone,
    private spinnerService: SpinnerService,
    private myAccountService: MyAccountService,
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
      ]]
    });
  }

  ngOnInit() {
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
    } else {
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
              this.myAccountService.updateCard();
              this.spinnerService.hideSpinner();
              this.ccPaymentForm.reset();
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

