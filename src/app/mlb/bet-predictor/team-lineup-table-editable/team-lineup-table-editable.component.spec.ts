import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLineupTableEditableComponent } from './team-lineup-table-editable.component';

describe('TeamLineupTableEditableComponent', () => {
  let component: TeamLineupTableEditableComponent;
  let fixture: ComponentFixture<TeamLineupTableEditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamLineupTableEditableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamLineupTableEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
