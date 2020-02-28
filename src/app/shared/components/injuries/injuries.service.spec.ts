import { TestBed, inject } from '@angular/core/testing';

import { InjuriesService } from './injuries.service';

describe('InjuriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InjuriesService]
    });
  });

  it('should be created', inject([InjuriesService], (service: InjuriesService) => {
    expect(service).toBeTruthy();
  }));
});
