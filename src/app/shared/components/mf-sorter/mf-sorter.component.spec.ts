import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfSorterComponent } from './mf-sorter.component';

describe('MfSorterComponent', () => {
  let component: MfSorterComponent;
  let fixture: ComponentFixture<MfSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
