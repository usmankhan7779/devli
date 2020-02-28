import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetPredictorComponent } from './bet-predictor.component';

describe('BetPredictorComponent', () => {
  let component: BetPredictorComponent;
  let fixture: ComponentFixture<BetPredictorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetPredictorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetPredictorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
