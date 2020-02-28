import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLineupHeadingRightComponent } from './team-lineup-heading-right.component';

describe('TeamLineupHeadingRightComponent', () => {
  let component: TeamLineupHeadingRightComponent;
  let fixture: ComponentFixture<TeamLineupHeadingRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamLineupHeadingRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamLineupHeadingRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
