import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchupsGatewayComponent } from './matchups-gateway.component';

describe('MatchupsGatewayComponent', () => {
  let component: MatchupsGatewayComponent;
  let fixture: ComponentFixture<MatchupsGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchupsGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchupsGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
