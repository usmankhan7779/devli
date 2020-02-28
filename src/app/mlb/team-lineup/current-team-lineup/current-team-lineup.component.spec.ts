import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTeamLineupComponent } from './current-team-lineup.component';

describe('CurrentTeamLineupComponent', () => {
  let component: CurrentTeamLineupComponent;
  let fixture: ComponentFixture<CurrentTeamLineupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentTeamLineupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentTeamLineupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
