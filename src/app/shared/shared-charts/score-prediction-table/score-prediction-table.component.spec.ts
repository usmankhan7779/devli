import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorePredictionTableComponent } from './score-prediction-table.component';

describe('ScorePredictionTableComponent', () => {
  let component: ScorePredictionTableComponent;
  let fixture: ComponentFixture<ScorePredictionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScorePredictionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorePredictionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
