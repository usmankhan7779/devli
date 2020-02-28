import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { SharedModule } from '../shared/shared.module';
import { ScholarshipProgramComponent } from './scholarship-program.component';

export const scholarshipProgramRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: ScholarshipProgramComponent,
    data: {
      breadcrumb: null,
      title: 'Lineups.com Future of Sports Scholarship Program'
    }
  }
]);

@NgModule({
  imports: [
    SharedModule,
    NgbModule,
    scholarshipProgramRouting
  ],
  declarations: [
    ScholarshipProgramComponent
  ],
  providers: [
  ]
})
export class ScholarshipProgramModule {}
