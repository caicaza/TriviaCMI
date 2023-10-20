import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioSalaComponent } from './inicio-sala.component';

describe('InicioSalaComponent', () => {
  let component: InicioSalaComponent;
  let fixture: ComponentFixture<InicioSalaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InicioSalaComponent]
    });
    fixture = TestBed.createComponent(InicioSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
