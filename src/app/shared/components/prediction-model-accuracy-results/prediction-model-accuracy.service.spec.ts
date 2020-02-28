import { TestBed, inject } from '@angular/core/testing';

import { PredictionModelAccuracyService } from './prediction-model-accuracy.service';

describe('PredictionModelAccuracyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PredictionModelAccuracyService]
    });
  });

  it('should be created', inject([PredictionModelAccuracyService], (service: PredictionModelAccuracyService) => {
    expect(service).toBeTruthy();
  }));
});
