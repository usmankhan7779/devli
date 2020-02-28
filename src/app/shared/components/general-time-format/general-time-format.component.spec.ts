import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTimeFormatComponent } from './general-time-format.component';

describe('GeneralTimeFormatComponent', () => {
  let component: GeneralTimeFormatComponent;
  let fixture: ComponentFixture<GeneralTimeFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralTimeFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTimeFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
