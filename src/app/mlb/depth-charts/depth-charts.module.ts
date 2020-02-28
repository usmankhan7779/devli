import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { RouterModule } from '@angular/router';
import { DepthChartsModuleComponent } from './depth-charts-module.component';
import { DepthChartsComponent } from './depth-charts.component';
import { SharedModule } from '../../shared/shared.module';
import { SingleDpItemComponent } from './single-dp-item/single-dp-item.component';
import { DepthChartsService } from './depth-charts.service';

const MLBDPRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: DepthChartsModuleComponent,
    data: {breadcrumb: null},
    children: [
      {
        path: '',
        component: DepthChartsComponent,
        data: {
          breadcrumb: null
        }
      }
    ]
  }
]);


@NgModule({
  imports: [
    SharedModule,
    MLBDPRouting,
  ],
  declarations: [
    DepthChartsModuleComponent,
    DepthChartsComponent,
    SingleDpItemComponent
  ],
  providers: [
    DepthChartsService
  ]
})
export class DepthChartsModule { }
