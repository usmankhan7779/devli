import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetsGatewayComponent } from './targets-gateway.component';

describe('TargetsGatewayComponent', () => {
  let component: TargetsGatewayComponent;
  let fixture: ComponentFixture<TargetsGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetsGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetsGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
