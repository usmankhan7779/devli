import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchupHeadingComponent } from './matchup-heading.component';

describe('MatchupHeadingComponent', () => {
  let component: MatchupHeadingComponent;
  let fixture: ComponentFixture<MatchupHeadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchupHeadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchupHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
