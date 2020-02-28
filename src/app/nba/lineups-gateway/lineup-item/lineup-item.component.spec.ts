import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineupItemComponent } from './lineup-item.component';

describe('LineupItemComponent', () => {
  let component: LineupItemComponent;
  let fixture: ComponentFixture<LineupItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineupItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
