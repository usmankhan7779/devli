import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusOnlyComponent } from './status-only.component';

describe('StatusOnlyComponent', () => {
  let component: StatusOnlyComponent;
  let fixture: ComponentFixture<StatusOnlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusOnlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
