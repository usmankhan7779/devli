import { NgModule } from '@angular/core';
import { MinutesComponent } from './minutes.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MinutesRouterComponent } from './minutes-router.component';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { MinutesResolver } from './minutes.resolver';
import { FantasyProjectionsComponent } from './fantasy-projections/fantasy-projections.component';
import { FantasyProjectionsService } from './fantasy-projections/fantasy-projections.service';
import { LineupsGatewayService } from '../lineups-gateway/lienups.service';

@NgModule({
  imports: [
    SharedModule,
    NgxPaginationModule,
    RouterModule,
    NgbModule,
    DataTableModule
  ],
  declarations: [
    MinutesRouterComponent,
    MinutesComponent,
    FantasyProjectionsComponent
  ],
  exports: [
    MinutesRouterComponent,
    MinutesComponent
  ],
  providers: [
    MinutesResolver,
    FantasyProjectionsService,
    LineupsGatewayService
  ]
})
export class MinutesModule {}
