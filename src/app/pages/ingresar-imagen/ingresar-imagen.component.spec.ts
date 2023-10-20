import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarImagenComponent } from './ingresar-imagen.component';

describe('IngresarImagenComponent', () => {
  let component: IngresarImagenComponent;
  let fixture: ComponentFixture<IngresarImagenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngresarImagenComponent]
    });
    fixture = TestBed.createComponent(IngresarImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
