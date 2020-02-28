import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// Modules
import { SharedModule } from '../../shared/shared.module';
import { FaqComponent } from './faq.component';

// Routes
export const staticRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: FaqComponent,
    data: {
      breadcrumb: 'FAQ',
      title: 'FAQ'
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
    FaqComponent
  ]
})
export class FaqModule {}
