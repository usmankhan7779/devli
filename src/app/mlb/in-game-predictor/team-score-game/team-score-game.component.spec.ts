import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamScoreGameComponent } from './team-score-game.component';

describe('TeamScoreGameComponent', () => {
  let component: TeamScoreGameComponent;
  let fixture: ComponentFixture<TeamScoreGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamScoreGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamScoreGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
