import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalList6XlColComponent } from './vertical-list-6-xl-col.component';

describe('VerticalList6XlColComponent', () => {
  let component: VerticalList6XlColComponent;
  let fixture: ComponentFixture<VerticalList6XlColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerticalList6XlColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalList6XlColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
