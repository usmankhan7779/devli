import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InGameBetsComponent } from './bets.component';

describe('BetsComponent', () => {
  let component: InGameBetsComponent;
  let fixture: ComponentFixture<InGameBetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InGameBetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InGameBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
