import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictedBetsComponent } from './predicted-bets.component';

describe('PredictedBetsComponent', () => {
  let component: PredictedBetsComponent;
  let fixture: ComponentFixture<PredictedBetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictedBetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictedBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
