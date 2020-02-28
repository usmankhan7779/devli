import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LineupsGatewayModuleComponent } from './lineups-gateway-module.component';
import { LineupsGatewayComponent } from './lineups-gateway.component';
import { LineupsGatewayService } from './lienups.service';
import { LineupItemComponent } from './lineup-item/lineup-item.component';
import { DepthChartSingleItemModule } from '../depth-charts/depth-chart-single-item/depth-chart-single-item.module';
import { DepthChartService } from '../depth-charts/depth-chart.service';

const NbaLineupsGatewayRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: LineupsGatewayModuleComponent,
    data: {breadcrumb: null},
    children: [
      {
        path: '',
        component: LineupsGatewayComponent,
        data: {
          breadcrumb: null,
          title: 'DYNAMIC'
        }
      }
    ]
  }
]);


@NgModule({
  imports: [
    SharedModule,
    DepthChartSingleItemModule,
    NbaLineupsGatewayRouting,
  ],
  declarations: [
    LineupsGatewayModuleComponent,
    LineupsGatewayComponent,
    LineupItemComponent
  ],
  providers: [
    LineupsGatewayService,
    DepthChartService
  ]
})
export class LineupsGatewayModule { }
