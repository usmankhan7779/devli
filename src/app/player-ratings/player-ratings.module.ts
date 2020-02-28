
// Routes
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerRatingsModuleComponent } from './player-ratings-module.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { PlayerRatingsComponent } from './player-ratings.component';
import { PlayerRatingsService } from './player-ratings.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';

export const staticRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: PlayerRatingsModuleComponent,
    data: {breadcrumb: null},
    children: [
      {
        path: '',
        component: PlayerRatingsComponent,
      }
    ]
  }

]);

@NgModule({
  imports: [
    SharedModule,
    NgbModule,
    DataTableModule,
    NgxPaginationModule,
    staticRouting
  ],
  declarations: [
    PlayerRatingsModuleComponent,
    PlayerRatingsComponent
  ],
  providers: [
    PlayerRatingsService
  ]
})
export class PlayerRatingsModule {}
