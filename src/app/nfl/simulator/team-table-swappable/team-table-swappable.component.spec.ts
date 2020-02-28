import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTableSwappableComponent } from './team-table-swappable.component';

describe('TeamTableSwappableComponent', () => {
  let component: TeamTableSwappableComponent;
  let fixture: ComponentFixture<TeamTableSwappableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamTableSwappableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTableSwappableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
