import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetMetricsComponent } from './bet-metrics.component';

describe('BetMetricsComponent', () => {
  let component: BetMetricsComponent;
  let fixture: ComponentFixture<BetMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
