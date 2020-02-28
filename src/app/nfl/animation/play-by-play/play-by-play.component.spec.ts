import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayByPlayComponent } from './play-by-play.component';

describe('PlayByPlayComponent', () => {
  let component: PlayByPlayComponent;
  let fixture: ComponentFixture<PlayByPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayByPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayByPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
