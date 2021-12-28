import { TestBed } from '@angular/core/testing';

import { FormFallasGeneradorService } from './form-fallas-generador.service';

describe('FormFallasGeneradorService', () => {
  let service: FormFallasGeneradorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormFallasGeneradorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
