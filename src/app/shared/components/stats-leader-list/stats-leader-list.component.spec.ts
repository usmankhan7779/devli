import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsLeaderListComponent } from './stats-leader-list.component';

describe('StatsLeaderListComponent', () => {
  let component: StatsLeaderListComponent;
  let fixture: ComponentFixture<StatsLeaderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsLeaderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsLeaderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
