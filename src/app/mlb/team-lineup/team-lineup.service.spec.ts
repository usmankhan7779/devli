import { TestBed, inject } from '@angular/core/testing';

import { TeamLineupService } from './team-lineup.service';

describe('TeamLineupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamLineupService]
    });
  });

  it('should be created', inject([TeamLineupService], (service: TeamLineupService) => {
    expect(service).toBeTruthy();
  }));
});
