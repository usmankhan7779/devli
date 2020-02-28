import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TeamRankingsModuleComponent } from './team-rankings-module.component';
import { TeamStatsComponent } from '../team-stats-offense-defense/team-stats.component';
import { TeamStatsOffenseDefenseModule } from '../team-stats-offense-defense/team-stats-offense-defense.module';
import { TeamStatsService } from '../team-stats.service';
import { TeamStatsOffenseDefenseResolver } from '../team-stats-offense-defense/team-stats-offense-defense.resolver';

const NbaLineupsGatewayRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: TeamRankingsModuleComponent,
    data: {breadcrumb: null},
    children: [
      {
        path: '',
        component: TeamStatsComponent,
        resolve: {
          teamStatsData: TeamStatsOffenseDefenseResolver
        },
        data: {
          breadcrumb: null,
          title: 'DYNAMIC',
          type: 'offense',
          pageType: 'rankings'
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
          type: 'defense',
          pageType: 'rankings'
        }
      }
    ]
  }
]);


@NgModule({
  imports: [
    TeamStatsOffenseDefenseModule,
    NbaLineupsGatewayRouting
  ],
  declarations: [
    TeamRankingsModuleComponent
  ],
  providers: [
    TeamStatsService
  ]
})
export class TeamRankingsModule { }
