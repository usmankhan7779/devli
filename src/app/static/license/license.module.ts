import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


// Modules
import { SharedModule } from '../../shared/shared.module';
import { LicenseComponent } from './license.component';

// Routes
export const staticRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: LicenseComponent,
    data: {
      breadcrumb: 'Data License Terms & Conditions',
      title: 'Data License Terms & Conditions'
    }
  }
]);

@NgModule({
  imports: [
    SharedModule,
    staticRouting
  ],
  declarations: [
    LicenseComponent
  ]
})
export class LicenseModule {}
