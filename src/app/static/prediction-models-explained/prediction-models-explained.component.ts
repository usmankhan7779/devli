import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-prediction-models-explained',
  templateUrl: './prediction-models-explained.component.html',
  styleUrls: ['./prediction-models-explained.component.scss']
})
export class PredictionModelsExplainedComponent implements OnInit {

  constructor(
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit() {
    this.breadcrumbService.changeBreadcrumbs([
      {
        label: 'Betting System',
        url: '/nfl/betting-system'
      },
      {
        label: 'Prediction Models Explained',
        url: '/prediction-models-explained'
      }
    ]);
  }

}
