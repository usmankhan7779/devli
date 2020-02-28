import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDepthChartComponent } from './individual-depth-chart.component';

describe('IndividualDepthChartComponent', () => {
  let component: IndividualDepthChartComponent;
  let fixture: ComponentFixture<IndividualDepthChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualDepthChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDepthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
