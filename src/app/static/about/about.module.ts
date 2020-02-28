import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// Modules
import { SharedModule } from '../../shared/shared.module';
import { AboutComponent } from './about.component';

// Routes
export const staticRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: AboutComponent,
    data: {
      breadcrumb: 'About',
      title: 'About'
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
    AboutComponent
  ]
})
export class AboutModule {}
