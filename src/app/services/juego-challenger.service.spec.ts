import { TestBed } from '@angular/core/testing';

import { JuegoChallengerService } from './juego-challenger.service';

describe('JuegoChallengerService', () => {
  let service: JuegoChallengerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JuegoChallengerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
