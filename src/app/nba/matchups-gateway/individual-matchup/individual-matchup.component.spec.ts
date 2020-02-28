import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualMatchupComponent } from './individual-matchup.component';

describe('IndividualMatchupComponent', () => {
  let component: IndividualMatchupComponent;
  let fixture: ComponentFixture<IndividualMatchupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualMatchupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualMatchupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
