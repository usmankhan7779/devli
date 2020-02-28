import { VegasOddsComponent } from './vegas-odds.component';
import { VegasOddsHpComponent } from './vegas-odds-hp/vegas-odds-hp.component';
import { RouterModule } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { MatchupBetsOddsItemComponent } from './matchup-bets-odds-item/matchup-bets-odds-item.component';
import { NbaLiveOddsTableComponent } from './live-odds/nba-live-odds-table/nba-live-odds-table.component';
import { NbaLiveOddsMobileTableComponent } from './matchup-bets-odds-item/nba-live-odds-mobile-table/nba-live-odds-mobile-table.component';
import { MlbLiveOddsTableComponent } from './live-odds/mlb-live-odds-table/mlb-live-odds-table.component';
import { MlbLiveOddsMobileTableComponent } from './matchup-bets-odds-item/mlb-live-odds-mobile-table/mlb-live-odds-mobile-table.component';
import { LiveOddsChartComponent } from './live-odds/live-odds-chart/live-odds-chart.component';
import { NflLiveOddsTableComponent } from './live-odds/nfl-live-odds-table/nfl-live-odds-table.component';
import { NflLiveOddsMobileTableComponent } from './matchup-bets-odds-item/nfl-live-odds-mobile-table/nfl-live-odds-mobile-table.component';
import { LiveOddsComponent } from './live-odds/live-odds.component';
import { environment } from '../../environments/environment';
import { AngularFireLite } from 'angularfire-lite';
import { LiveOddsService } from './live-odds/live-odds.service';
import { SharedChartsModule } from '../shared/shared-charts/shared-charts.module';

const vegasOddsRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: VegasOddsComponent,
    data: {breadcrumb: null},
    children: [
      {
        path: '',
        component: VegasOddsHpComponent,
        data: {
          breadcrumb: null
        }
      },
      {
        path: 'nfl-live-vegas-odds',
        component: LiveOddsComponent,
        data: {
          league: 'nfl',
          breadcrumb: null
        }
      },
      {
        path: 'nba-live-vegas-odds',
        component: LiveOddsComponent,
        data: {
          league: 'nba',
          breadcrumb: null
        }
      },
      {
        path: 'mlb-live-vegas-odds',
        component: LiveOddsComponent,
        data: {
          league: 'mlb',
          breadcrumb: null
        }
      }
    ]
  }
]);


@NgModule({
  imports: [
    NgbModule,
    SharedModule,
    DataTableModule,
    AngularFireLite.forRoot(environment.firebase),
    vegasOddsRouting,
    SharedChartsModule
  ],
  declarations: [
    LiveOddsComponent,
    VegasOddsComponent,
    VegasOddsHpComponent,
    MatchupBetsOddsItemComponent,
    NbaLiveOddsTableComponent,
    NbaLiveOddsMobileTableComponent,
    MlbLiveOddsTableComponent,
    MlbLiveOddsMobileTableComponent,
    NflLiveOddsTableComponent,
    NflLiveOddsMobileTableComponent,
    LiveOddsChartComponent,
  ],
  providers: [
    LiveOddsService
  ]
})
export class VegasOddsModule { }
