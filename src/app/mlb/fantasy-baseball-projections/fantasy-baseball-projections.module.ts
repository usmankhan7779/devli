import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { FantasyBaseballProjectionsRouteComponent } from './fantasy-baseball-projections-route.component';
import { FantasyBaseballProjectionsComponent } from './fantasy-baseball-projections.component';
import { FantasyProjectionsService } from './fantasy-baseball-projections.service';

export const moduleRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: FantasyBaseballProjectionsRouteComponent,
    data: {breadcrumb: null},
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: FantasyBaseballProjectionsComponent,
        data: {
          title: 'MLB Fantasy Baseball Projections: Daily Projections'
        }
      }
    ]
  }
]);


@NgModule({
  imports: [
    SharedModule,
    NgxPaginationModule,
    RouterModule,
    NgbModule,
    DataTableModule,
    moduleRouting
  ],
  declarations: [
    FantasyBaseballProjectionsRouteComponent,
    FantasyBaseballProjectionsComponent
  ],
  exports: [

  ],
  providers: [
    FantasyProjectionsService
  ]
})
export class FantasyBaseballProjectionsModule {}
