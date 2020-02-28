import { SharedModule } from '../../../shared/shared.module';
import { NflTeamRankingsModuleComponent } from './nfl-team-rankings-module.component';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TeamRankingsComponent } from './team-rankings.component';
import { TeamRankingsService } from './team-rankings.service';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamService } from '../team.service';
import { TeamRankingsResolver } from './team-rankings.resolver';

const Routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: NflTeamRankingsModuleComponent,
    data: {breadcrumb: null},
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: TeamRankingsComponent,
        resolve: {
          teamRankingsData: TeamRankingsResolver
        }
      },
      {
        path: ':type',
        pathMatch: 'full',
        component: TeamRankingsComponent,
        resolve: {
          teamRankingsData: TeamRankingsResolver
        }
      },
    ]
  }
]);


@NgModule({
  imports: [
    NgbModule,
    SharedModule,
    DataTableModule,
    Routing
  ],
  declarations: [
    NflTeamRankingsModuleComponent,
    TeamRankingsComponent
  ],
  providers: [
    TeamService,
    TeamRankingsService,
    TeamRankingsResolver
  ]
})
export class NflTeamRankingsModule { }
