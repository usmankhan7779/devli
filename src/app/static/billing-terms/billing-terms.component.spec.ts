import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingTermsComponent } from './billing-terms.component';

describe('BillingTermsComponent', () => {
  let component: BillingTermsComponent;
  let fixture: ComponentFixture<BillingTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
