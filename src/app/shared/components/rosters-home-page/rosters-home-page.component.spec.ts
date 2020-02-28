import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RostersHomePageComponent } from './rosters-home-page.component';

describe('RostersHomePageComponent', () => {
  let component: RostersHomePageComponent;
  let fixture: ComponentFixture<RostersHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RostersHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RostersHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
