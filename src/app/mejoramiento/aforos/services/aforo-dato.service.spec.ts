import { TestBed } from '@angular/core/testing';

import { AforoDatoService } from './aforo-dato.service';

describe('AforoDatoService', () => {
  let service: AforoDatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AforoDatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
