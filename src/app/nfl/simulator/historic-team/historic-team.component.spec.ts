import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricTeamComponent } from './historic-team.component';

describe('HistoricTeamComponent', () => {
  let component: HistoricTeamComponent;
  let fixture: ComponentFixture<HistoricTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
