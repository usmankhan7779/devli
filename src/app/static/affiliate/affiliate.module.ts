import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// Modules
import { SharedModule } from '../../shared/shared.module';
import { AffiliateComponent } from './affiliate.component';

// Routes
export const staticRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: AffiliateComponent,
    data: {
      breadcrumb: 'Affiliate Program',
      title: 'Betting & Daily Fantasy Affiliate Program'
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
    AffiliateComponent
  ]
})
export class AffiliateModule {}
