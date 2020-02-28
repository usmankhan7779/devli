
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParkFactorToolsModuleComponent } from './park-factor-tools-module.component';
import { ParkFactorToolsGatewayComponent } from './park-factor-tools-gateway.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { ParkFactorService } from './park-factor.service';
import { ParkFactorItemComponent } from './park-factor-item/park-factor-item.component';

export const moduleRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: ParkFactorToolsModuleComponent,
    data: {breadcrumb: null},
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ParkFactorToolsGatewayComponent,
        data: {
          title: 'MLB Park Factors: MLB Stadium Weather + Ratings'
        }
      }
    ]
  }

]);

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    NgbModule,
    DataTableModule,
    moduleRouting
  ],
  declarations: [
    ParkFactorToolsGatewayComponent,
    ParkFactorToolsModuleComponent,
    ParkFactorItemComponent
  ],
  providers: [
    ParkFactorService
  ]
})
export class ParkFactorToolsModule {}
