import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NhlComponent } from './nhl.component';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { NhlService } from './nhl.service';
import { StartingGoaliesComponent } from './starting-goalies/starting-goalies.component';
import { LineCombinationsComponent } from './line-combinations/line-combinations.component';

const nhlRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: NhlComponent,
    // data: {breadcrumb: 'NHL'},
    data: {breadcrumb: null},
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/'
      },
      {
        path: 'starting-goalies',
        component: StartingGoaliesComponent,
        data: {
          title: 'NHL Starting Goalies',
        }
      },
      {
        path: 'teams/line-combinations',
        component: LineCombinationsComponent,
        data: {
          title: 'NHL Team Line Combinations',
        }
      }
    ]
  }
]);


@NgModule({
  declarations: [
    NhlComponent,
    StartingGoaliesComponent,
    LineCombinationsComponent,
  ],
  imports: [
    NgbModule,
    SharedModule,
    NgxPaginationModule,
    DataTableModule,
    nhlRouting
  ],
  providers: [
    NhlService
  ]
})
export class NhlModule { }
