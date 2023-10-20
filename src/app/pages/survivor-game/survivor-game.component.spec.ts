import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurvivorGameComponent } from './survivor-game.component';

describe('SurvivorGameComponent', () => {
  let component: SurvivorGameComponent;
  let fixture: ComponentFixture<SurvivorGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurvivorGameComponent]
    });
    fixture = TestBed.createComponent(SurvivorGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
