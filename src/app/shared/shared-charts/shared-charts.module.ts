import { NgModule } from '@angular/core';

import { Chart } from 'chart.js';
import 'chartjs-plugin-datalabels';


import { GraphTableComponent } from './graph-table/graph-table.component';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';
import { WinProbabilityChartComponent } from './win-probability-chart/win-probability-chart.component';
import { ScorePredictionTableComponent } from './score-prediction-table/score-prediction-table.component';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    PipesModule,
    DirectivesModule
  ],
  declarations: [
    GraphTableComponent,
    WinProbabilityChartComponent,
    ScorePredictionTableComponent
  ],
  exports: [
    GraphTableComponent,
    WinProbabilityChartComponent,
    ScorePredictionTableComponent
  ],
  entryComponents: [
  ]
})
export class SharedChartsModule {}
