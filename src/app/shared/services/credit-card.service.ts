import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from 'environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
declare const Stripe: any;

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  expMonthOpts = [
    {id: 1, value: 'Jan', octalValue: '01'},
    {id: 2, value: 'Feb', octalValue: '02'},
    {id: 3, value: 'Mar', octalValue: '03'},
    {id: 4, value: 'Apr', octalValue: '04'},
    {id: 5, value: 'May', octalValue: '05'},
    {id: 6, value: 'June', octalValue: '06'},
    {id: 7, value: 'July', octalValue: '07'},
    {id: 8, value: 'August', octalValue: '08'},
    {id: 9, value: 'September', octalValue: '09'},
    {id: 10, value: 'October', octalValue: '10'},
    {id: 11, value: 'November', octalValue: '11'},
    {id: 12, value: 'December', octalValue: '12'}
  ];
  usStates = [
    { name: 'ALABAMA', abbreviation: 'AL'},
    { name: 'ALASKA', abbreviation: 'AK'},
    { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
    { name: 'ARIZONA', abbreviation: 'AZ'},
    { name: 'ARKANSAS', abbreviation: 'AR'},
    { name: 'CALIFORNIA', abbreviation: 'CA'},
    { name: 'COLORADO', abbreviation: 'CO'},
    { name: 'CONNECTICUT', abbreviation: 'CT'},
    { name: 'DELAWARE', abbreviation: 'DE'},
    { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
    { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
    { name: 'FLORIDA', abbreviation: 'FL'},
    { name: 'GEORGIA', abbreviation: 'GA'},
    { name: 'GUAM', abbreviation: 'GU'},
    { name: 'HAWAII', abbreviation: 'HI'},
    { name: 'IDAHO', abbreviation: 'ID'},
    { name: 'ILLINOIS', abbreviation: 'IL'},
    { name: 'INDIANA', abbreviation: 'IN'},
    { name: 'IOWA', abbreviation: 'IA'},
    { name: 'KANSAS', abbreviation: 'KS'},
    { name: 'KENTUCKY', abbreviation: 'KY'},
    { name: 'LOUISIANA', abbreviation: 'LA'},
    { name: 'MAINE', abbreviation: 'ME'},
    { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
    { name: 'MARYLAND', abbreviation: 'MD'},
    { name: 'MASSACHUSETTS', abbreviation: 'MA'},
    { name: 'MICHIGAN', abbreviation: 'MI'},
    { name: 'MINNESOTA', abbreviation: 'MN'},
    { name: 'MISSISSIPPI', abbreviation: 'MS'},
    { name: 'MISSOURI', abbreviation: 'MO'},
    { name: 'MONTANA', abbreviation: 'MT'},
    { name: 'NEBRASKA', abbreviation: 'NE'},
    { name: 'NEVADA', abbreviation: 'NV'},
    { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
    { name: 'NEW JERSEY', abbreviation: 'NJ'},
    { name: 'NEW MEXICO', abbreviation: 'NM'},
    { name: 'NEW YORK', abbreviation: 'NY'},
    { name: 'NORTH CAROLINA', abbreviation: 'NC'},
    { name: 'NORTH DAKOTA', abbreviation: 'ND'},
    { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
    { name: 'OHIO', abbreviation: 'OH'},
    { name: 'OKLAHOMA', abbreviation: 'OK'},
    { name: 'OREGON', abbreviation: 'OR'},
    { name: 'PALAU', abbreviation: 'PW'},
    { name: 'PENNSYLVANIA', abbreviation: 'PA'},
    { name: 'PUERTO RICO', abbreviation: 'PR'},
    { name: 'RHODE ISLAND', abbreviation: 'RI'},
    { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
    { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
    { name: 'TENNESSEE', abbreviation: 'TN'},
    { name: 'TEXAS', abbreviation: 'TX'},
    { name: 'UTAH', abbreviation: 'UT'},
    { name: 'VERMONT', abbreviation: 'VT'},
    { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
    { name: 'VIRGINIA', abbreviation: 'VA'},
    { name: 'WASHINGTON', abbreviation: 'WA'},
    { name: 'WEST VIRGINIA', abbreviation: 'WV'},
    { name: 'WISCONSIN', abbreviation: 'WI'},
    { name: 'WYOMING', abbreviation: 'WY' }
  ];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // if (isPlatformBrowser(this.platformId)) {
    //   Stripe.setPublishableKey(environment.stripe.key);
    // }
  }

  createCreditCardToken(dataToCreateFrom, callback) {
    // if (isPlatformBrowser(this.platformId)) {
    //   Stripe.card.createToken(dataToCreateFrom, callback);
    // }
  }

  setCreditCard(token) {
    const endpoint = `${environment.api_url}/payments/cards`;
    return this.http.post(endpoint, {
      stripeToken: token
    });
  }

  verifyPromoCode(planId, promoCode) {
    const endpoint = `${environment.api_url}/payments/coupon`;
    return this.http.post(endpoint, {
      'plan': planId,
      'promo-code': promoCode
    });
  }

  subscribeToPlan(planId, promoCode?) {
    const endpoint = `${environment.api_url}/payments/subscribe`;
    return this.http.post(endpoint, {
      'plan': planId,
      'promo-code': promoCode
    });
  }

  unsubscribeFromPlan(planId) {
    const endpoint = `${environment.api_url}/payments/unsubscribe`;
    return this.http.post(endpoint, {
      plan: planId
    });
  }

  changePlan(planId, promoCode?) {
    const endpoint = `${environment.api_url}/payments/change`;
    return this.http.post(endpoint, {
      'plan': planId,
      'promo-code': promoCode
    });
  }

  getCreditCard() {
    const endpoint = `${environment.api_url}/payments/cards`;
    return this.http.get(endpoint);
  }

  getMySubscriptions() {
    const endpoint = `${environment.api_url}/payments/subscriptions`;
    return this.http.get(endpoint);
  }

}
