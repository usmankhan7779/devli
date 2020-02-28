import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextPlayComponent } from './next-play.component';

describe('NextPlayComponent', () => {
  let component: NextPlayComponent;
  let fixture: ComponentFixture<NextPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
