import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingToolsGlossaryComponent } from './betting-tools-glossary.component';

describe('BettingToolsGlossaryComponent', () => {
  let component: BettingToolsGlossaryComponent;
  let fixture: ComponentFixture<BettingToolsGlossaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BettingToolsGlossaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingToolsGlossaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
