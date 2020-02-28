import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetPredictorNewsTabComponent } from './bet-predictor-news-tab.component';

describe('BetPredictorNewsTabComponent', () => {
  let component: BetPredictorNewsTabComponent;
  let fixture: ComponentFixture<BetPredictorNewsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetPredictorNewsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetPredictorNewsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
