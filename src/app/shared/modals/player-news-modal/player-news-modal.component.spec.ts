import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerNewsModalComponent } from './player-news-modal.component';

describe('PlayerNewsModalComponent', () => {
  let component: PlayerNewsModalComponent;
  let fixture: ComponentFixture<PlayerNewsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerNewsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerNewsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
