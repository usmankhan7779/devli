import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnershipComponent } from './ownership.component';

describe('OwnershipComponent', () => {
  let component: OwnershipComponent;
  let fixture: ComponentFixture<OwnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
