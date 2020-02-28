import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwappableTableComponent } from './swappable-table.component';

describe('SwappableTableComponent', () => {
  let component: SwappableTableComponent;
  let fixture: ComponentFixture<SwappableTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwappableTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwappableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
