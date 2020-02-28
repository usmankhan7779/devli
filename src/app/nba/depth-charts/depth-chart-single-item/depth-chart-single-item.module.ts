import { DepthChartSingleItemComponent } from './depth-chart-single-item.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    DepthChartSingleItemComponent
  ],
  exports: [
    DepthChartSingleItemComponent
  ]
})
export class DepthChartSingleItemModule { }
