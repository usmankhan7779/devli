import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorMetricsComponent } from './simulator-metrics.component';

describe('SimulatorMetricsComponent', () => {
  let component: SimulatorMetricsComponent;
  let fixture: ComponentFixture<SimulatorMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulatorMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
