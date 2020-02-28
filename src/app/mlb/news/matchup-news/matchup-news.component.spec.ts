import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchupNewsComponent } from './matchup-news.component';

describe('MatchupNewsComponent', () => {
  let component: MatchupNewsComponent;
  let fixture: ComponentFixture<MatchupNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchupNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchupNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
