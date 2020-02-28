import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionModelAccuracyResultsComponent } from './prediction-model-accuracy-results.component';

describe('PredictionModelAccuracyResultsComponent', () => {
  let component: PredictionModelAccuracyResultsComponent;
  let fixture: ComponentFixture<PredictionModelAccuracyResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictionModelAccuracyResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictionModelAccuracyResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
