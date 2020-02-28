import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FantasyProjectionsComponent } from './fantasy-projections.component';
import { MinutesRouterComponent } from '../minutes-router.component';
import { MinutesModule } from '../minutes.module';
import { LineupsGatewayService } from '../../lineups-gateway/lienups.service';


// Modules

// Routes
export const staticRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: MinutesRouterComponent,
    data: {breadcrumb: null},
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: FantasyProjectionsComponent,
      }
    ]
  }

]);

@NgModule({
  imports: [
    MinutesModule,
    staticRouting
  ],
  providers: [
    LineupsGatewayService
  ]
})
export class FantasyProjectionsModule {}
