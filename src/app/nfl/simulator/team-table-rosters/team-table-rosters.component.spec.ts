import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTableRostersComponent } from './team-table-rosters.component';

describe('TeamTableRostersComponent', () => {
  let component: TeamTableRostersComponent;
  let fixture: ComponentFixture<TeamTableRostersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamTableRostersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTableRostersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
