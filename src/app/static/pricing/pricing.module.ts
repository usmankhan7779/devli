import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// Modules
import { SharedModule } from '../../shared/shared.module';
import { PricingComponent } from './pricing.component';

// Routes
export const staticRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: PricingComponent,
    data: {
      breadcrumb: 'Pricing',
      title: 'Pricing'
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
    PricingComponent
  ]
})
export class PricingModule {}
