import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaSalaComponent } from './entrada-sala.component';

describe('EntradaSalaComponent', () => {
  let component: EntradaSalaComponent;
  let fixture: ComponentFixture<EntradaSalaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntradaSalaComponent]
    });
    fixture = TestBed.createComponent(EntradaSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
