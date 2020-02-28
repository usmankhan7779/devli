import { NflDailyFantasyDfsProjectionsComponent } from './nfl-daily-fantasy-dfs-projections.component';
import { NflDailyFantasyDfsProjectionsModuleComponent } from './nfl-daily-fantasy-dfs-projections-module.component';
import { RouterModule } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

const title = 'NFL Daily Fantasy (DFS) Projections';

const Routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: NflDailyFantasyDfsProjectionsModuleComponent,
    data: {breadcrumb: title},
    children: [
      {
        path: '',
        component: NflDailyFantasyDfsProjectionsComponent,
        data: {
          title: title
        }
      }
    ]
  }
]);


@NgModule({
  imports: [
    SharedModule,
    Routing
  ],
  declarations: [
    NflDailyFantasyDfsProjectionsComponent,
    NflDailyFantasyDfsProjectionsModuleComponent
  ],
  providers: [
  ]
})
export class NflDailyFantasyDfsProjectionsModule { }
