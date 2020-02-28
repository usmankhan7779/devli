import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// Modules
import { TermsUseComponent } from './terms-use.component';
import { SharedModule } from '../../shared/shared.module';

// Routes
export const staticRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: TermsUseComponent,
    data: {
      breadcrumb: 'Terms of Use',
      title: 'Terms'
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
    TermsUseComponent
  ]
})
export class TermsUseModule {}
