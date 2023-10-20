import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosicionPlayerComponent } from './posicion-player.component';

describe('PosicionPlayerComponent', () => {
  let component: PosicionPlayerComponent;
  let fixture: ComponentFixture<PosicionPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosicionPlayerComponent]
    });
    fixture = TestBed.createComponent(PosicionPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
