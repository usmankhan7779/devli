import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MinutesRouterComponent } from './minutes-router.component';
import { MinutesComponent } from './minutes.component';
import { MinutesResolver } from './minutes.resolver';
import { MinutesModule } from './minutes.module';
import { FantasyProjectionsService } from './fantasy-projections/fantasy-projections.service';


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
        component: MinutesComponent,
        resolve: {
          minutesData: MinutesResolver
        },
        data: {
          main: 'minutes'
        }
      }
    ]
  }

]);

@NgModule({
  imports: [
    MinutesModule,
    staticRouting
  ],
  declarations: [
  ],
  providers: [
    FantasyProjectionsService
  ]
})
export class NbaPlayerMinutesPerGameModule {}
