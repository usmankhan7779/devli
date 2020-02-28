import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { SinglePlayerComponent } from './single-player.component';
import { SinglePlayerResolver } from './single-player.resolver';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { SinglePlayerService } from './single-player.service';
import { NbaSinglePlayerComponent } from './nba-single-player.component';
import { MinutesResolver } from '../../minutes/minutes.resolver';
import { MinutesComponent } from '../../minutes/minutes.component';
import { MinutesModule } from '../../minutes/minutes.module';


// Modules

// Routes
export const staticRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: NbaSinglePlayerComponent,
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
          main: 'stats'
        }
      },
      {
        path: ':name',
        component: SinglePlayerComponent,
        resolve: {
          playerData: SinglePlayerResolver
        }
      },
      {
        path: ':name/:id',
        component: SinglePlayerComponent,
        resolve: {
          playerData: SinglePlayerResolver
        }
      }
    ]
  }

]);

@NgModule({
  imports: [
    SharedModule,
    NgbModule,
    DataTableModule,
    staticRouting,
    MinutesModule
  ],
  declarations: [
    NbaSinglePlayerComponent,
    SinglePlayerComponent
  ],
  providers: [
    SinglePlayerService,
    SinglePlayerResolver
  ]
})
export class NbaSinglePlayerModule {}
