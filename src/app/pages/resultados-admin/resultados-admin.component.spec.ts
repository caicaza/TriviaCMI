import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosAdminComponent } from './resultados-admin.component';

describe('ResultadosAdminComponent', () => {
  let component: ResultadosAdminComponent;
  let fixture: ComponentFixture<ResultadosAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultadosAdminComponent]
    });
    fixture = TestBed.createComponent(ResultadosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
