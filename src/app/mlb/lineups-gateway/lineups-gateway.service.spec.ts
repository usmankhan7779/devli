import { TestBed, inject } from '@angular/core/testing';

import { LineupsGatewayService } from './lineups-gateway.service';

describe('LineupsGatewayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LineupsGatewayService]
    });
  });

  it('should be created', inject([LineupsGatewayService], (service: LineupsGatewayService) => {
    expect(service).toBeTruthy();
  }));
});
