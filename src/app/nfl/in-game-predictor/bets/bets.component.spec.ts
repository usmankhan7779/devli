import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetsInGameComponent } from './bets.component';

describe('BetsInGameComponent', () => {
  let component: BetsInGameComponent;
  let fixture: ComponentFixture<BetsInGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetsInGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetsInGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
