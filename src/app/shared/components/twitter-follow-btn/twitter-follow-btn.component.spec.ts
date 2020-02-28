import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterFollowBtnComponent } from './twitter-follow-btn.component';

describe('TwitterFollowBtnComponent', () => {
  let component: TwitterFollowBtnComponent;
  let fixture: ComponentFixture<TwitterFollowBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitterFollowBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterFollowBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
