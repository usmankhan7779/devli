import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DollarsComponent } from './dollars.component';

describe('DollarsComponent', () => {
  let component: DollarsComponent;
  let fixture: ComponentFixture<DollarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DollarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DollarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
