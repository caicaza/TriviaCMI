import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaGameComponent } from './pregunta-game.component';

describe('PreguntaGameComponent', () => {
  let component: PreguntaGameComponent;
  let fixture: ComponentFixture<PreguntaGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreguntaGameComponent]
    });
    fixture = TestBed.createComponent(PreguntaGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
