import { TestBed } from '@angular/core/testing';

import { FormUnidadesMuestreoGeneradorService } from './form-unidades-muestreo-generador.service';

describe('FormUnidadesMuestreoGeneradorService', () => {
  let service: FormUnidadesMuestreoGeneradorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormUnidadesMuestreoGeneradorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
