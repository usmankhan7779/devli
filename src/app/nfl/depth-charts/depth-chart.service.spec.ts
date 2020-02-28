import { TestBed, inject } from '@angular/core/testing';

import { DepthChartService } from './depth-chart.service';

describe('DepthChartsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DepthChartService]
    });
  });

  it('should be created', inject([DepthChartService], (service: DepthChartService) => {
    expect(service).toBeTruthy();
  }));
});
