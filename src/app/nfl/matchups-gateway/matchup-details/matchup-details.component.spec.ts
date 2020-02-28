import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchupDetailsComponent } from './matchup-details.component';

describe('MatchupDetailsComponent', () => {
  let component: MatchupDetailsComponent;
  let fixture: ComponentFixture<MatchupDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchupDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
