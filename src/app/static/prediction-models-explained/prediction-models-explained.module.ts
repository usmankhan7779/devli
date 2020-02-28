import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// Modules
import { SharedModule } from '../../shared/shared.module';
import { PredictionModelsExplainedComponent } from './prediction-models-explained.component';

// Routes
export const staticRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: PredictionModelsExplainedComponent,
    data: {
      breadcrumb: null,
      title: 'Machine Learning Betting Prediction Models Explained'
    }
  }
]);

@NgModule({
  imports: [
    SharedModule,
    NgbModule,
    staticRouting
  ],
  declarations: [
    PredictionModelsExplainedComponent
  ]
})
export class PredictionModelsExplainedModule {}
