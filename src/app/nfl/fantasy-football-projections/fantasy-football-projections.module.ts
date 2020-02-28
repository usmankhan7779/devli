import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FantasyFootballProjectionsModuleComponent } from './fantasy-football-projections-module.component';
import { FantasyFootballProjectionsComponent } from './fantasy-football-projections.component';
import { RouterModule } from '@angular/router';

const Routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: FantasyFootballProjectionsModuleComponent,
    data: {breadcrumb: null},
    children: [
      {
        path: '',
        component: FantasyFootballProjectionsComponent,
        data: {
          breadcrumb: null,
          title: 'Fantasy Football Projections, NFL Fantasy Projections'
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
    FantasyFootballProjectionsModuleComponent,
    FantasyFootballProjectionsComponent
  ],
  providers: [
  ]
})
export class FantasyFootballProjectionsModule { }
