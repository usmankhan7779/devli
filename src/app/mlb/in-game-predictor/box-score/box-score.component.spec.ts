import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxScoreComponent } from './box-score.component';

describe('BoxScoreComponent', () => {
  let component: BoxScoreComponent;
  let fixture: ComponentFixture<BoxScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
