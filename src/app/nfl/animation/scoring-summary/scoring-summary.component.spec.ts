import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoringSummaryComponent } from './scoring-summary.component';

describe('ScoringSummaryComponent', () => {
  let component: ScoringSummaryComponent;
  let fixture: ComponentFixture<ScoringSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoringSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoringSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
