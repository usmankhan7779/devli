import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FootballGameComponent } from './football-game.component';

describe('FootballGameComponent', () => {
  let component: FootballGameComponent;
  let fixture: ComponentFixture<FootballGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FootballGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FootballGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
