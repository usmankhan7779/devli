import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuriesComponent } from './injuries.component';

describe('InjuriesComponent', () => {
  let component: InjuriesComponent;
  let fixture: ComponentFixture<InjuriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InjuriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
