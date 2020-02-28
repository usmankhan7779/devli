import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionModelsExplainedComponent } from './prediction-models-explained.component';

describe('PredictionModelsExplainedComponent', () => {
  let component: PredictionModelsExplainedComponent;
  let fixture: ComponentFixture<PredictionModelsExplainedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictionModelsExplainedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictionModelsExplainedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
