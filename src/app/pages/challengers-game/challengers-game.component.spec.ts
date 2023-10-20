import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengersGameComponent } from './challengers-game.component';

describe('ChallengersGameComponent', () => {
  let component: ChallengersGameComponent;
  let fixture: ComponentFixture<ChallengersGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengersGameComponent]
    });
    fixture = TestBed.createComponent(ChallengersGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
