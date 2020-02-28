import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepthChartSingleItemComponent } from './depth-chart-single-item.component';

describe('DepthChartSingleItemComponent', () => {
  let component: DepthChartSingleItemComponent;
  let fixture: ComponentFixture<DepthChartSingleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepthChartSingleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepthChartSingleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
