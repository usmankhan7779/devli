import { TestBed, inject } from '@angular/core/testing';

import { BetPredictorService } from './bet-predictor.service';

describe('BetPredictorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BetPredictorService]
    });
  });

  it('should be created', inject([BetPredictorService], (service: BetPredictorService) => {
    expect(service).toBeTruthy();
  }));
});
