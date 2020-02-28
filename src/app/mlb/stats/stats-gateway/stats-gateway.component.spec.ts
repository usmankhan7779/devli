import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsGatewayComponent } from './stats-gateway.component';

describe('StatsGatewayComponent', () => {
  let component: StatsGatewayComponent;
  let fixture: ComponentFixture<StatsGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
