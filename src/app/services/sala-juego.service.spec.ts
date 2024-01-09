import { TestBed } from '@angular/core/testing';

import { SalaJuegoService } from './sala-juego.service';

describe('SalaJuegoService', () => {
  let service: SalaJuegoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaJuegoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
