import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { SimulatorComponent } from './simulator.component';
import { HistoricTeamComponent } from './historic-team/historic-team.component';
import { SimulatorMetricsComponent } from './simulator-metrics/simulator-metrics.component';
import { TeamTableSwappableComponent } from './team-table-swappable/team-table-swappable.component';
import { TeamTableRostersComponent } from './team-table-rosters/team-table-rosters.component';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CountoModule } from 'angular2-counto';

const SimulatorRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: SimulatorComponent,
    data: {
      title: 'NFL Game Simulators',
      breadcrumb: 'Simulator'
    }
  }
]);


@NgModule({
  declarations: [
    SimulatorComponent,
    HistoricTeamComponent,
    SimulatorMetricsComponent,
    TeamTableSwappableComponent,
    TeamTableRostersComponent,
  ],
  imports: [
    NgbModule,
    CountoModule,
    SharedModule,
    SimulatorRouting
  ],
  providers: [
  ]
})
export class SimulatorModule { }
