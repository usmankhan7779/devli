import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineupsGatewayComponent } from './lineups-gateway.component';

describe('LineupsGatewayComponent', () => {
  let component: LineupsGatewayComponent;
  let fixture: ComponentFixture<LineupsGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineupsGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineupsGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
