import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtBatPredictionComponent } from './at-bat-prediction.component';

describe('AtBatPredictionComponent', () => {
  let component: AtBatPredictionComponent;
  let fixture: ComponentFixture<AtBatPredictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtBatPredictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtBatPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
