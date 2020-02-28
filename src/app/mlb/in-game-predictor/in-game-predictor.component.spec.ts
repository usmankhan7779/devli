import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InGamePredictorComponent } from './in-game-predictor.component';

describe('InGamePredictorComponent', () => {
  let component: InGamePredictorComponent;
  let fixture: ComponentFixture<InGamePredictorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InGamePredictorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InGamePredictorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
