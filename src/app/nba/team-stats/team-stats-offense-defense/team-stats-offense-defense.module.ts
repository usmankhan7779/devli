import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { TeamStatsOffenseDefenseModuleComponent } from './team-stats-offense-defense-module.component';
import { TeamStatsComponent } from './team-stats.component';
import { TeamStatsOffenseDefenseResolver } from './team-stats-offense-defense.resolver';
import { TeamStatsService } from '../team-stats.service';

@NgModule({
  imports: [
    SharedModule,
    NgxPaginationModule,
    RouterModule,
    NgbModule,
    DataTableModule
  ],
  declarations: [
    TeamStatsOffenseDefenseModuleComponent,
    TeamStatsComponent
  ],
  exports: [
    TeamStatsOffenseDefenseModuleComponent,
    TeamStatsComponent
  ],
  providers: [
    TeamStatsOffenseDefenseResolver,
    TeamStatsService
  ]
})
export class TeamStatsOffenseDefenseModule {}
