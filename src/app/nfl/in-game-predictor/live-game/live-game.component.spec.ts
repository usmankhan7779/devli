import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveGameComponent } from './live-game.component';

describe('LiveGameComponent', () => {
  let component: LiveGameComponent;
  let fixture: ComponentFixture<LiveGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
