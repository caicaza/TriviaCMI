import { TestBed } from '@angular/core/testing';

import { UsuarioSalaService } from './usuario-sala.service';

describe('UsuarioSalaService', () => {
  let service: UsuarioSalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioSalaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
