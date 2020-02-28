import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// Modules
import { SharedModule } from '../../shared/shared.module';
import { BillingTermsComponent } from './billing-terms.component';

// Routes
export const staticRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: BillingTermsComponent,
    data: {
      breadcrumb: 'Billing Terms',
      title: 'Billing Terms'
    }
  }
]);

@NgModule({
  imports: [
    SharedModule,
    NgbModule,
    staticRouting
  ],
  declarations: [
    BillingTermsComponent
  ]
})
export class BillingTermsModule {}
