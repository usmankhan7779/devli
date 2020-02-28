import { TestBed, inject } from '@angular/core/testing';

import { BetMetricsService } from './bet-metrics.service';

describe('BetMetricsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BetMetricsService]
    });
  });

  it('should be created', inject([BetMetricsService], (service: BetMetricsService) => {
    expect(service).toBeTruthy();
  }));
});
