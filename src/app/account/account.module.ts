import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

import { AccountComponent } from './account.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { SubscriptionComponent } from './my-account/subscription/subscription.component';
import { CreditCardComponent } from './my-account/credit-card/credit-card.component';
import { AccountDetailsComponent } from './my-account/account-details/account-details.component';
import { EmailSettingsComponent } from './my-account/email-settings/email-settings.component';

import { UpdateSubscriptionComponent } from './my-account/update-subscription/update-subscription.component';
import { MyAccountService } from './my-account/my-account.service';

export const accountRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: AccountComponent,
    data: {breadcrumb: 'Account'},
    children: [
      {
        path: '',
        component: MyAccountComponent,
        data: {
          breadcrumb: null,
          title: 'My Account'
        }
      }
    ]
  }
]);

@NgModule({
  declarations: [
    AccountComponent,
    MyAccountComponent,
    SubscriptionComponent,
    CreditCardComponent,
    AccountDetailsComponent,
    EmailSettingsComponent,
    UpdateSubscriptionComponent
  ],
  imports: [
    SharedModule,
    NgbModule,
    FormsModule,
    accountRouting
  ],
  entryComponents: [UpdateSubscriptionComponent],
  providers: [
    MyAccountService
  ]
})

export class AccountModule {
}
