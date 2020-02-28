import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TeamStatsModuleComponent } from './team-stats-module.component';
import { SharedModule } from '../../shared/shared.module';
import { TeamStatsGatewayComponent } from './team-stats-gateway.component';
import { TeamStatsComponent } from './team-stats-offense-defense/team-stats.component';
import { TeamStatsGatewayResolver } from './team-stats-gateway.resolver';
import { TeamStatsService } from './team-stats.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { TeamStatsOffenseDefenseResolver } from './team-stats-offense-defense/team-stats-offense-defense.resolver';
import { TeamStatsOffenseDefenseModule } from './team-stats-offense-defense/team-stats-offense-defense.module';


const NbaLineupsGatewayRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: TeamStatsModuleComponent,
    data: {breadcrumb: null},
    children: [
      {
        path: '',
        component: TeamStatsGatewayComponent,
        resolve: {
          teamStatsData: TeamStatsGatewayResolver
        },
        data: {
          breadcrumb: null,
          title: 'DYNAMIC'
        }
      },
      {
        path: 'offense',
        component: TeamStatsComponent,
        resolve: {
          teamStatsData: TeamStatsOffenseDefenseResolver
        },
        data: {
          breadcrumb: null,
          title: 'DYNAMIC',
          type: 'offense'
        }
      },
      {
        path: 'defense',
        component: TeamStatsComponent,
        resolve: {
          teamStatsData: TeamStatsOffenseDefenseResolver
        },
        data: {
          breadcrumb: null,
          title: 'DYNAMIC',
          type: 'defense'
        }
      }
    ]
  }
]);


@NgModule({
  imports: [
    SharedModule,
    NgxPaginationModule,
    NgbModule,
    DataTableModule,
    TeamStatsOffenseDefenseModule,
    NbaLineupsGatewayRouting
  ],
  declarations: [
    TeamStatsModuleComponent,
    TeamStatsGatewayComponent
  ],
  providers: [
    TeamStatsGatewayResolver,
    TeamStatsService
  ]
})
export class TeamStatsModule { }
