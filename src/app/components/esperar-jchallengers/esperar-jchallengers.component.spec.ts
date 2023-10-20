import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsperarJChallengersComponent } from './esperar-jchallengers.component';

describe('EsperarJChallengersComponent', () => {
  let component: EsperarJChallengersComponent;
  let fixture: ComponentFixture<EsperarJChallengersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsperarJChallengersComponent]
    });
    fixture = TestBed.createComponent(EsperarJChallengersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
